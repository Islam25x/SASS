import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchUserProfileUseCase } from "../application/user/fetch-user-profile.usecase";
import type { UserProfile } from "../domain/user/user.types";
import { ApiError } from "../infrastructure/api/api-error";

export const USER_PROFILE_QUERY_KEY = ["user", "profile"] as const;

export function useUserProfile(): UseQueryResult<UserProfile, ApiError> {
  return useQuery<UserProfile, ApiError>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: ({ signal }) => fetchUserProfileUseCase({ signal }),
    staleTime: 1000 * 60 * 5,
  });
}
