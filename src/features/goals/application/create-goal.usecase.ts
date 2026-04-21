import { ApiError } from "../../../shared/api/api-error";
import {
  CreateGoalInputSchema,
  type CreateGoalInput,
} from "../../../domain/goals/goal.schema";
import { createGoalApi } from "../api/create-goal.api";

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export type CreateGoalFormInput = {
  title: string;
  description: string;
  targetAmount: number;
  durationValue: number;
  monthlyAmount: number;
};

function mapInputToPayload(input: CreateGoalFormInput): CreateGoalInput {
  const title = input.title.trim();
  const description = input.description.trim();

  if (!title) {
    throw new ApiError("Goal title is required.", 400, "INVALID_RESPONSE");
  }

  if (!Number.isFinite(input.targetAmount) || input.targetAmount <= 0) {
    throw new ApiError("Target amount must be greater than zero.", 400, "INVALID_RESPONSE");
  }

  if (!Number.isFinite(input.durationValue) || input.durationValue <= 0) {
    throw new ApiError("Duration must be greater than zero.", 400, "INVALID_RESPONSE");
  }

  if (!Number.isFinite(input.monthlyAmount) || input.monthlyAmount <= 0) {
    throw new ApiError("Monthly amount must be greater than zero.", 400, "INVALID_RESPONSE");
  }

  return CreateGoalInputSchema.parse({
    title,
    description,
    targetAmount: roundToTwoDecimals(input.targetAmount),
    durationValue: roundToTwoDecimals(input.durationValue),
    durationUnit: "Months",
    monthlyAmount: roundToTwoDecimals(input.monthlyAmount),
  });
}

export async function createGoalUseCase(
  input: CreateGoalFormInput,
  options?: { signal?: AbortSignal },
): Promise<void> {
  await createGoalApi(mapInputToPayload(input), options);
}
