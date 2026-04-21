import { ApiError } from "../../../shared/api/api-error";
import { GoalListSchema, GoalSchema, type Goal } from "../../../domain/goals/goal.schema";

type GoalsEnvelope = {
  data?: unknown;
  result?: unknown;
  payload?: unknown;
};

type GoalResponseDto = {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  targetAmount?: unknown;
  durationValue?: unknown;
  durationUnit?: unknown;
  monthlyAmount?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isGoalDto(value: unknown): value is GoalResponseDto {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.description === "string" &&
    typeof value.targetAmount === "number" &&
    Number.isFinite(value.targetAmount) &&
    value.targetAmount > 0 &&
    typeof value.durationValue === "number" &&
    Number.isFinite(value.durationValue) &&
    value.durationValue > 0 &&
    value.durationUnit === "Months" &&
    typeof value.monthlyAmount === "number" &&
    Number.isFinite(value.monthlyAmount) &&
    value.monthlyAmount > 0
  );
}

function mapGoalDto(dto: unknown): Goal {
  if (!isGoalDto(dto)) {
    throw new ApiError("Goal item is invalid.", 500, "INVALID_RESPONSE");
  }

  return GoalSchema.parse({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    targetAmount: dto.targetAmount,
    durationValue: dto.durationValue,
    durationUnit: dto.durationUnit,
    monthlyAmount: dto.monthlyAmount,
  });
}

export function extractGoalsData(response: unknown): unknown {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isObject(response)) {
    throw new ApiError("Goals response is invalid.", 500, "INVALID_RESPONSE");
  }

  const candidate = response as GoalsEnvelope;

  if (typeof candidate.data !== "undefined") {
    return extractGoalsData(candidate.data);
  }

  if (typeof candidate.result !== "undefined") {
    return extractGoalsData(candidate.result);
  }

  if (typeof candidate.payload !== "undefined") {
    return extractGoalsData(candidate.payload);
  }

  throw new ApiError("Goals response is invalid.", 500, "INVALID_RESPONSE");
}

export function mapGoalsResponseToGoals(response: unknown): Goal[] {
  const data = extractGoalsData(response);

  if (!Array.isArray(data)) {
    throw new ApiError("Goals response is invalid.", 500, "INVALID_RESPONSE");
  }

  return GoalListSchema.parse(data.map(mapGoalDto));
}
