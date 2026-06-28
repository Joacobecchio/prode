import { z } from "zod";

export const predictionSchema = z.object({
  matchId: z.string().min(1),
  homeScore: z.coerce.number().int().min(0).max(20),
  awayScore: z.coerce.number().int().min(0).max(20),
});

export const adminRoundSchema = z.object({
  starId: z.string().min(1),
  number: z.coerce.number().int().positive(),
  competition: z.string().min(3),
  startsAt: z.string().min(1),
  closesAt: z.string().min(1),
});

export type AdminRoundFormValues = z.infer<typeof adminRoundSchema>;
