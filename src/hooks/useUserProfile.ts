import { useEffect } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getUserProfileUseCase } from "../features/user/application/get-profile.usecase";
import type { User } from "../features/user/domain/user";
import { ApiError } from "../shared/api/api-error";
import { useAuth } from "../shared/auth/AuthContext";

export const USER_PROFILE_QUERY_KEY = ["user", "profile"] as const;

export function useUserProfile(): UseQueryResult<User, ApiError> {
  const { session, isAuthenticated, setUser } = useAuth();
  const query = useQuery<User, ApiError>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: ({ signal }) => getUserProfileUseCase({ signal }),
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
    initialData: session?.user,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
}
