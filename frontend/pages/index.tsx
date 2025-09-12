// frontend/pages/index.tsx
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();


  // tRPC hooks
  const createSession = trpc.session.create.useMutation();
  const getMessages = trpc.session.getMessages.useQuery(
    sessionId ? { sessionId } : undefined,
    { enabled: !!sessionId }
  );
  const addMessage = trpc.session.addMessage.useMutation();
  const queryMut = trpc.query.useMutation();

  // 🔹 On mount: restore sessionId from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sessionId");
    if (stored) {
      setSessionId(Number(stored));
    }
  }, []);

  // ensure session helper
  async function ensureSession() {
    if (sessionId) return sessionId;
    const s = await createSession.mutateAsync();
    setSessionId(s.id);
    localStorage.setItem("sessionId", String(s.id)); // 🔹 persist session
    return s.id;
  }

  async function handleUpload() {
    if (!file) return alert("Choose a PDF first");
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL not set");

      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${backendUrl.replace(/\/$/, "")}/ingest`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();

      setFileName(json.fileName || file.name);

      const sid = await ensureSession();
      await addMessage.mutateAsync({
        sessionId: sid,
        role: "assistant",
        content: `Ingested file: ${json.fileName || file.name}`,
      });

      getMessages.refetch();
      alert("Ingested successfully");
    } catch (e) {
      alert("Upload failed: " + String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk() {
    if (!question) return;
    setLoading(true);
    try {
      const sid = await ensureSession();
      await queryMut.mutateAsync({
        question,
        sessionId: sid,
        fileName: fileName ?? undefined,
      });

      setQuestion("");
      getMessages.refetch();
    } catch (e) {
      alert("Query failed: " + String(e));
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Reset chat (clear localStorage + new session on next action)
 function handleNewChat() {
    localStorage.removeItem("sessionId");
    setSessionId(null);
    setFileName(null);
    setQuestion("");

    // clear cached messages
    queryClient.removeQueries({ queryKey: [["session","getMessages"]] });
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">PaperRAG — Q&A Demo</h1>

      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          onClick={handleUpload}
          className="ml-4 px-4 py-2 bg-slate-800 text-white rounded"
          disabled={loading}
        >
          Upload & Index
        </button>
        <div className="text-sm mt-2">
          Ingested file: {fileName ?? "none"}
        </div>
      </div>

      <textarea
        className="w-full h-20 p-2 border rounded mb-2"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={handleAsk}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          Ask
        </button>
        <button
          onClick={handleNewChat}
          className="px-4 py-2 border rounded"
        >
          New Chat
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Conversation</h2>
        {getMessages.data?.map((m: any) => (
          <div
            key={m.id}
            className={`mb-3 p-3 rounded ${
              m.role === "user" ? "bg-white border" : "bg-gray-100"
            }`}
          >
            <div className="text-sm text-gray-600">{m.role}</div>
            <div className="mt-1 whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
