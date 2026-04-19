import { useEffect } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getUserProfileUseCase } from "../features/user/application/get-profile.usecase";
import type { User } from "../features/user/domain/user";
import { ApiError } from "../shared/api/api-error";
import { useAuth } from "../shared/auth/AuthContext";

export const USER_PROFILE_QUERY_KEY = ["user", "profile"] as const;

export function useUserProfile(): UseQueryResult<User, ApiError> {
  const { session, setUser } = useAuth();
  const token = session?.token ?? "";
  const query = useQuery<User, ApiError>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: ({ signal }) =>
      getUserProfileUseCase({
        signal,
        accessToken: token,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
    initialData: session?.user,
  });

  useEffect(() => {
    if (query.data && query.data !== session?.user) {
      setUser(query.data);
    }
  }, [query.data, session?.user, setUser]);

  return query;
}
