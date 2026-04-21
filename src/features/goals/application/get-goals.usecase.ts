import type { Goal } from "../../../domain/goals/goal.schema";
import { getGoalsApi } from "../api/get-goals.api";
import { mapGoalsResponseToGoals } from "./goal.mapping";

export async function getGoalsUseCase(
  options?: { signal?: AbortSignal; accessToken?: string },
): Promise<Goal[]> {
  const response = await getGoalsApi(options);
  return mapGoalsResponseToGoals(response);
}
