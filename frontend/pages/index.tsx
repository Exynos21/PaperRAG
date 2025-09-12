// frontend/pages/index.tsx
import { useEffect, useState, useRef } from "react";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // tRPC hooks
  const createSession = trpc.session.create.useMutation();
  const getMessages = trpc.session.getMessages.useQuery(
    (sessionId ? { sessionId } : undefined) as any,
    { enabled: !!sessionId }
  );
  const addMessage = trpc.session.addMessage.useMutation();
  const queryMut = trpc.query.useMutation();

  // Restore session
  useEffect(() => {
    const stored = localStorage.getItem("sessionId");
    if (stored) setSessionId(Number(stored));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [getMessages.data]);

  async function ensureSession() {
    if (sessionId) return sessionId;
    const s = await createSession.mutateAsync();
    setSessionId(s.id);
    localStorage.setItem("sessionId", String(s.id));
    return s.id;
  }

  // ✅ Fixed handleUpload to use file state
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ingest`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      console.log("Upload response:", data);

      // store uploaded file name
      setFileName(file.name);

      alert("File uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + String(err));
    } finally {
      setLoading(false);
    }
  };

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

  function handleNewChat() {
    localStorage.removeItem("sessionId");
    setSessionId(null);
    setFileName(null);
    setQuestion("");
    queryClient.removeQueries({ queryKey: [["session", "getMessages"]] });
  }

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="p-4 bg-slate-800 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">📄 PaperRAG</h1>
        <button
          onClick={handleNewChat}
          className="px-3 py-1 text-sm bg-red-600 rounded"
        >
          New Chat
        </button>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {getMessages.data?.map((m: any) => (
          <div
            key={m.id}
            className={`mb-3 flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-lg p-3 rounded-2xl shadow ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              <div className="text-xs opacity-70">{m.role}</div>
              <div className="mt-1 whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-sm italic">Thinking...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        <button
          onClick={handleUpload}
          className="px-3 py-1 bg-slate-700 text-white rounded text-sm"
          disabled={loading}
        >
          Upload
        </button>
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={handleAsk}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          Ask
        </button>
      </div>
    </main>
  );
}
