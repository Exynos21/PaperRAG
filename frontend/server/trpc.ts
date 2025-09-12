// frontend/server/trpc.ts
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const t = initTRPC.create();

async function ensureSessionById(sessionId?: number) {
  if (!sessionId) {
    const s = await prisma.session.create({ data: {} });
    return s.id;
  }
  // Try to find; if missing, create a session with that id using connectOrCreate pattern
  const existing = await prisma.session.findUnique({ where: { id: sessionId } });
  if (existing) return existing.id;

  // If sessionId was provided but not present, create a fresh session (id will be new)
  const s = await prisma.session.create({ data: {} });
  return s.id;
}

export const appRouter = t.router({
  // sessions router
  session: t.router({
    create: t.procedure.mutation(async () => {
      const s = await prisma.session.create({ data: {} });
      return s;
    }),

    list: t.procedure.query(async () => {
      return prisma.session.findMany({ orderBy: { createdAt: "desc" } });
    }),

    getMessages: t.procedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        return prisma.message.findMany({
          where: { sessionId: input.sessionId },
          orderBy: { createdAt: "asc" },
        });
      }),

    addMessage: t.procedure
      .input(
        z.object({
          sessionId: z.number().optional(),
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Ensure session exists; returns a valid sessionId
        const sid = await ensureSessionById(input.sessionId);

        // Create message and connect to session (safe)
        const msg = await prisma.message.create({
          data: {
            role: input.role,
            content: input.content,
            session: {
              connect: { id: sid },
            },
          },
        });
        return msg;
      }),
  }),

  // Query: build context -> call backend -> save messages (user + assistant)
  query: t.procedure
    .input(
      z.object({
        question: z.string(),
        sessionId: z.number().optional(),
        fileName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const backendUrl = process.env.BACKEND_URL;
      if (!backendUrl) throw new Error("BACKEND_URL (or NEXT_PUBLIC_BACKEND_URL) must be set");

      // Ensure session exists (returns numeric id)
      let sessionId = await ensureSessionById(input.sessionId);

      // fetch recent messages for context
      const msgs = await prisma.message.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
      });

      const MAX_CONTEXT_MESSAGES = 8;
      const recent = msgs.slice(-MAX_CONTEXT_MESSAGES);
      const prefix = recent.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");

      const payload: any = { question: input.question };
      if (prefix) payload.context = prefix;
      if (input.fileName) payload.fileName = input.fileName;

      // call backend ML endpoint
      const resp = await fetch(`${backendUrl.replace(/\/$/, "")}/query_with_sources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Backend error: ${resp.status} ${txt}`);
      }

      const data = await resp.json();

      // Persist user + assistant messages in a transaction to avoid partial writes
      await prisma.$transaction([
        prisma.message.create({
          data: {
            role: "user",
            content: input.question,
            session: { connect: { id: sessionId } },
          },
        }),
        prisma.message.create({
          data: {
            role: "assistant",
            content: data.answer ?? "",
            session: { connect: { id: sessionId } },
          },
        }),
      ]);

      // return backend result and sessionId for frontend
      return { ...data, sessionId };
    }),
});

export type AppRouter = typeof appRouter;
