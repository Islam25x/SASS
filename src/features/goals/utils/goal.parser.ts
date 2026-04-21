import { ApiError } from "../../../shared/api/api-error";
import { GoalSchema, type Goal } from "../types/goal.types";

type GoalsEnvelope = {
  data?: unknown;
  result?: unknown;
  payload?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractGoalsData(response: unknown): unknown {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isObject(response)) {
    throw new ApiError("Goals response is invalid.", 500, "INVALID_RESPONSE");
  }

  const candidate = response as GoalsEnvelope;

  if (candidate.data !== undefined) {
    return extractGoalsData(candidate.data);
  }

  if (candidate.result !== undefined) {
    return extractGoalsData(candidate.result);
  }

  if (candidate.payload !== undefined) {
    return extractGoalsData(candidate.payload);
  }

  throw new ApiError("Goals response is invalid.", 500, "INVALID_RESPONSE");
}

export function parseGoals(response: unknown): Goal[] {
  const data = extractGoalsData(response);

  if (!Array.isArray(data)) {
    throw new ApiError("Goals response is invalid.", 500, "INVALID_RESPONSE");
  }

  return data.map((item: any) =>
    GoalSchema.parse({
      id: item.goalId,
      title: item.title,
      description: item.description,
      targetAmount: item.targetAmount,
      monthlyAmount: item.monthlyAmount,

      durationValue:
        item.monthlyAmount > 0
          ? Math.ceil(item.targetAmount / item.monthlyAmount)
          : 0,

      durationUnit: "Months",
    })
  );
}