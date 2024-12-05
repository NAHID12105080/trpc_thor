import { trpc } from "../context";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// This is the router that will handle all the URL related requests
export const urlRouter = trpc.router({
  getShortUrl: trpc.procedure.input(z.string()).query(async ({ input }) => {
    const url = await prisma.url.findUnique({
      where: {
        shortUrl: input,
      },
    });

    if (!url) {
      throw new Error("URL not found");
    }

    return url.originalUrl;
  }),

  createShortUrl: trpc.procedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const shortUrl = Math.random().toString(36).substring(7);
      await prisma.url.create({
        data: {
          originalUrl: input.url,
          shortUrl,
        },
      });

      return shortUrl;
    }),
});
