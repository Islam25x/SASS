import { z } from "zod";

export const GoalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  target: z.number().finite(),
  progress: z.number().finite().optional(),
});

export type Goal = z.infer<typeof GoalSchema>;
