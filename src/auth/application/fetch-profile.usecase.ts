import type { User } from "../../user/domain/user";
import { fetchUserProfileApi } from "../api/user.api";
import { mapProfileToUser } from "../mappers/user.mapper";

export async function fetchUserProfileUseCase(
  options?: { signal?: AbortSignal },
): Promise<User> {
  const response = await fetchUserProfileApi(options);
  return mapProfileToUser(response);
}
