// frontend/server/trpc.ts
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const t = initTRPC.create();

export const appRouter = t.router({
  // session router
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

  // Query procedure: builds context, forwards to FastAPI, stores messages
query: t.procedure
  .input(z.object({ question: z.string(), sessionId: z.number().optional() }))
  .mutation(async ({ input }) => {
    const backendUrl =
      process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) throw new Error("BACKEND_URL not set in .env.local");

    let sessionId = input.sessionId;
    if (!sessionId) {
      const s = await prisma.session.create({ data: {} });
      sessionId = s.id;
    }

    const msgs = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    const recent = msgs.slice(-8);
    const prefix = recent
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const payload: any = { question: input.question };
    if (prefix) payload.context = prefix;

    let data: any;
    try {
      const resp = await fetch(
        `${backendUrl.replace(/\/$/, "")}/query_with_sources`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Backend error: ${resp.status} ${txt}`);
      }

      data = await resp.json();
    } catch (err) {
      console.error("Backend fetch failed:", err);
      return {
        answer: "Sorry, the backend service is currently unavailable.",
        sources: [],
        sessionId,
      };
    }

    // Save messages
    await prisma.message.create({
      data: { sessionId, role: "user", content: input.question },
    });
    await prisma.message.create({
      data: { sessionId, role: "assistant", content: data.answer ?? "" },
    });

    return { ...data, sessionId };
  }),

});

export type AppRouter = typeof appRouter;
