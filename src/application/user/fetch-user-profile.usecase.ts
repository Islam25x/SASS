import type { UserProfile } from "../../domain/user/user.types";
import { fetchUserProfileApi } from "../../infrastructure/api/user.api";
import { normalizeUserProfile } from "./user-profile";

export async function fetchUserProfileUseCase(
  options?: { signal?: AbortSignal },
): Promise<UserProfile> {
  const response = await fetchUserProfileApi(options);
  return normalizeUserProfile(response);
}
