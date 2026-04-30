import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { loginApi } from "../api/auth.api";
import type { AuthSession, LoginPayload } from "../types/auth.types";
import { extractLoginData, parseAuthSession, readLoginToken } from "../utils/auth.parser";
import { fetchUserProfileApi } from "../../user/api/user.api";
import { USER_PROFILE_QUERY_KEY } from "../../user/hooks/useUserProfile";
import { extractUserData, parseUser } from "../../user/utils/user.parser";
import { ApiError } from "../../../infrastructure/api/api-error";
import { TRANSACTION_CATEGORIES_QUERY_KEY } from "../../transactions/hooks/useCategories";

type LoginMutation = UseMutationResult<AuthSession, ApiError, LoginPayload>;

type UseLoginResult = LoginMutation & {
  cancel: () => void;
};

export function useLogin(): UseLoginResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<AuthSession, ApiError, LoginPayload>({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const loginResponse = await loginApi(
          {
            email: payload.email.trim(),
            password: payload.password,
          },
          { signal: controller.signal },
        );

        const loginData = extractLoginData(loginResponse);
        const profileResponse = await fetchUserProfileApi({
          signal: controller.signal,
          authTokenOverride: readLoginToken(loginData),
        });

        const user = parseUser(extractUserData(profileResponse));
        return parseAuthSession(loginData, user);
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: TRANSACTION_CATEGORIES_QUERY_KEY }),
      ]);
    },
    retry: 0,
  });

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    ...mutation,
    cancel: () => abortControllerRef.current?.abort(),
  };
}
