import { fetchUserProfileApi } from "../api/user.api";
import type { User } from "../domain/user";
import { extractUserData, mapUserDtoToUser } from "../mappers/user.mapper";

export async function getUserProfileUseCase(
  options?: { signal?: AbortSignal },
): Promise<User> {
  const response = await fetchUserProfileApi(options);
  const userData = extractUserData(response);
  return mapUserDtoToUser(userData);
}
