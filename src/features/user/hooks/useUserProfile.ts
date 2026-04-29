import { useEffect } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchUserProfileApi } from "../api/user.api";
import type { User } from "../types/user.types";
import { extractUserData, parseUser } from "../utils/user.parser";
import { ApiError } from "../../../infrastructure/api/api-error";
import { useAuth } from "../../../shared/auth/AuthContext";

export const USER_PROFILE_QUERY_KEY = ["user", "profile"] as const;

export function useUserProfile(): UseQueryResult<User, ApiError> {
  const { session, setUser } = useAuth();
  const token = session?.token ?? "";
  const query = useQuery<User, ApiError>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async ({ signal }) => {
      const response = await fetchUserProfileApi({
        signal,
        accessToken: token,
      });

      return parseUser(extractUserData(response), {
        profileImageCacheKey: Date.now(),
      });
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
    placeholderData: session?.user,
  });

  useEffect(() => {
    if (query.data && query.data !== session?.user) {
      setUser(query.data);
    }
  }, [query.data, session?.user, setUser]);

  return query;
}
