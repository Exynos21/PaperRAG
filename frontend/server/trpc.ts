// frontend/server/trpc.ts
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const t = initTRPC.create();

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
          sessionId: z.number(),
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return prisma.message.create({
          data: {
            sessionId: input.sessionId,
            role: input.role,
            content: input.content,
          },
        });
      }),
  }),

  // Query: build context -> call backend -> save messages
  query: t.procedure
    .input(
      z.object({
        question: z.string(),
        sessionId: z.number().optional(),
        fileName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) throw new Error("BACKEND_URL (or NEXT_PUBLIC_BACKEND_URL) must be set");

      // ensure session
      let sessionId = input.sessionId;
      if (!sessionId) {
        const s = await prisma.session.create({ data: {} });
        sessionId = s.id;
      }

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

      // persist user + assistant messages
      await prisma.message.create({
        data: { sessionId, role: "user", content: input.question },
      });
      await prisma.message.create({
        data: { sessionId, role: "assistant", content: data.answer ?? "" },
      });

      // return backend result and sessionId for frontend
      return { ...data, sessionId };
    }),
});

export type AppRouter = typeof appRouter;
