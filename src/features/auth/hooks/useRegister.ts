import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { registerApi } from "../api/auth.api";
import type { RegisterPayload, RegisterResult } from "../types/auth.types";
import { extractRegisterData, parseRegisterResult } from "../utils/auth.parser";
import { ApiError } from "../../../shared/api/api-error";

type RegisterMutation = UseMutationResult<
  RegisterResult,
  ApiError,
  RegisterPayload
>;

type UseRegisterResult = RegisterMutation & {
  cancel: () => void;
};

export function useRegister(): UseRegisterResult {
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<RegisterResult, ApiError, RegisterPayload>({
    mutationKey: ["auth", "register"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await registerApi(
          {
            email: payload.email.trim(),
            username: payload.username.trim(),
            password: payload.password,
            confirmPassword: payload.confirmPassword,
          },
          { signal: controller.signal },
        );

        return parseRegisterResult(extractRegisterData(response));
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
