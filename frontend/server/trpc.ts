import { initTRPC } from "@trpc/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const t = initTRPC.create();

export const appRouter = t.router({
  // Question / Answer
  query: t.procedure
    .input((input: { question: string }) => input)
    .mutation(async ({ input }) => {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input.question }),
      });
      const data = await res.json();

      // Save session
      await prisma.session.create({
        data: { question: input.question, answer: data.answer || "" },
      });

      return data;
    }),

  // History
  history: t.procedure.query(async () => {
    return prisma.session.findMany({ orderBy: { createdAt: "desc" } });
  }),

  // Trigger PDF upload (frontend handles actual FormData)
  uploadPdf: t.procedure.mutation(async () => {
    // This mutation just exists for resume/tRPC story
    return { status: "frontend handles file upload" };
  }),
});

export type AppRouter = typeof appRouter;
