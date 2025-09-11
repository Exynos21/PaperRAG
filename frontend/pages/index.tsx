// frontend/pages/index.tsx
import { useState } from "react";
import { trpc } from "../utils/trpc"; // keep this from your earlier setup

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const createSession = trpc.session.create.useMutation();
  const listSessions = trpc.session.list.useQuery(undefined, { enabled: false });
  const getMessages = trpc.session.getMessages.useQuery(
    sessionId ? { sessionId } : undefined,
    { enabled: !!sessionId }
  );
  const addMessage = trpc.session.addMessage.useMutation();
  const queryMut = trpc.query.useMutation();

  async function ensureSession() {
    if (sessionId) return sessionId;
    const s = await createSession.mutateAsync();
    setSessionId(s.id);
    return s.id;
  }

  async function upload() {
    if (!file) return alert("Choose PDF first");
    setLoading(true);
    try {
      const sid = await ensureSession();

      const form = new FormData();
      form.append("file", file);
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/ingest", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      alert("Ingested: " + JSON.stringify(json));
      // Optionally: add a system message about the file uploaded
      await addMessage.mutateAsync({ sessionId: sid, role: "assistant", content: `Ingested file: ${file.name}` });
      getMessages.refetch();
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
      const sid = await ensureSession();
      const res = await queryMut.mutateAsync({ question, sessionId: sid });
      setQuestion("");
      getMessages.refetch();
    } catch (e) {
      alert("Query failed: " + e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">PaperRAG — Q&A Demo</h1>

      <div className="mb-4">
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button onClick={upload} className="ml-4 px-4 py-2 bg-slate-800 text-white rounded" disabled={loading}>
          Upload & Index
        </button>
      </div>

      <textarea className="w-full h-20 p-2 border rounded mb-2" placeholder="Ask a question..." value={question} onChange={(e)=>setQuestion(e.target.value)} />

      <div className="flex gap-2">
        <button onClick={ask} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>Ask</button>
        <button onClick={() => { setSessionId(null); getMessages.refetch(); }} className="px-4 py-2 border rounded">
          New Chat
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Conversation</h2>
        {getMessages.data?.map((m:any) => (
          <div key={m.id} className={`mb-3 p-3 rounded ${m.role === "user" ? "bg-white border" : "bg-gray-100"}`}>
            <div className="text-sm text-gray-600">{m.role}</div>
            <div className="mt-1">{m.content}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
