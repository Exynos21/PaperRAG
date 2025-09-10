import { useState } from "react";
import { trpc } from "../utils/trpc";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const queryMutation = trpc.query.useMutation();
  const historyQuery = trpc.history.useQuery();
  const uploadTrigger = trpc.uploadPdf.useMutation();

  async function upload() {
    if (!file) return alert("Choose a PDF first");
    setLoading(true);
    try {
      // Trigger tRPC mutation (for resume story)
      await uploadTrigger.mutateAsync();

      // Actual upload to FastAPI
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/ingest", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      alert(`File ingested! Chunks processed: ${data.chunks_indexed}`);
    } catch (e) {
      alert("Upload failed: " + e);
    } finally {
      setLoading(false);
    }
  }

  async function ask() {
    if (!question) return;
    setLoading(true);
    try {
      const data = await queryMutation.mutateAsync({ question });
      setAnswer(data.answer);
      historyQuery.refetch();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">PaperRAG — Q&A Demo</h1>

      {/* PDF Upload */}
      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          className="ml-4 px-4 py-2 bg-slate-800 text-white rounded"
          onClick={upload}
          disabled={loading}
        >
          Upload & Index
        </button>
      </div>

      {/* Question Input */}
      <textarea
        className="w-full h-20 p-2 border rounded mb-2"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={ask}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        Ask
      </button>

      {/* Answer + History */}
      <div className="mt-6">
        <pre className="bg-gray-100 p-4 rounded">{answer}</pre>
        <h2 className="text-xl font-semibold mt-4 mb-2">History</h2>
        {historyQuery.data?.map((s) => (
          <div key={s.id} className="mb-4 border-b pb-2">
            <p className="font-medium">Q: {s.question}</p>
            <p className="text-gray-700">A: {s.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
