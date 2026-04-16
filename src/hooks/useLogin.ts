import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { loginUseCase } from "../application/auth/login.usecase";
import type { LoginPayload, LoginResponse } from "../domain/auth/auth.types";
import { ApiError } from "../infrastructure/api/api-error";

type LoginMutation = UseMutationResult<LoginResponse, ApiError, LoginPayload>;

type UseLoginResult = LoginMutation & {
  cancel: () => void;
};

export function useLogin(): UseLoginResult {
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await loginUseCase(payload, { signal: controller.signal });
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
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
