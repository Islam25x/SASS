import { z } from "zod";

export const GoalDurationUnitSchema = z.literal("Months");

export const GoalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  targetAmount: z.number().positive(),
  durationValue: z.number().positive(),
  durationUnit: GoalDurationUnitSchema,
  monthlyAmount: z.number().positive(),
});

export const GoalListSchema = z.array(GoalSchema);

export const CreateGoalInputSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  targetAmount: z.number().positive(),
  durationValue: z.number().positive(),
  durationUnit: GoalDurationUnitSchema,
  monthlyAmount: z.number().positive(),
});

export type Goal = z.infer<typeof GoalSchema>;
export type GoalDurationUnit = z.infer<typeof GoalDurationUnitSchema>;
export type CreateGoalInput = z.infer<typeof CreateGoalInputSchema>;
