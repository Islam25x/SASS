import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchUserProfileApi } from "../api/user.api";
import type { User } from "../types/user.types";
import { extractUserData, parseUser } from "../utils/user.parser";
import { ApiError } from "../../../infrastructure/api/api-error";
import { useAuth } from "../../../shared/auth/AuthContext";

export const USER_PROFILE_QUERY_KEY = ["user", "profile"] as const;

export function useUserProfile(): UseQueryResult<User, ApiError> {
  const { isAuthenticated, session, setUser } = useAuth();
  const query = useQuery<User, ApiError>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async ({ signal }) => {
      const response = await fetchUserProfileApi({
        signal,
      });

      const user = parseUser(extractUserData(response), {
        profileImageCacheKey: Date.now(),
      });
      setUser(user);
      return user;
    },
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
    initialData: session?.user,
  });

  return {
    ...query,
    data: session?.user ?? query.data,
  } as UseQueryResult<User, ApiError>;
}
