import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { registerApi, REGISTER_SUCCESS_MESSAGE } from "../api/auth.api";
import type { RegisterPayload, RegisterResult } from "../types/auth.types";
import { extractRegisterData, parseRegisterResult } from "../utils/auth.parser";
import { ApiError } from "../../../infrastructure/api/api-error";

type RegisterMutation = UseMutationResult<
  RegisterResult,
  ApiError,
  RegisterPayload
>;

type UseRegisterResult = RegisterMutation & {
  cancel: () => void;
};

function isRegisterSuccessMessage(message: string): boolean {
  const normalizedMessage = message.trim().toLowerCase();

  return (
    normalizedMessage.includes("registration successful") ||
    normalizedMessage.includes("confirm your account")
  );
}

export function useRegister(): UseRegisterResult {
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<RegisterResult, ApiError, RegisterPayload>({
    mutationKey: ["auth", "register"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        let response: unknown;
        try {
          response = await registerApi(
            {
              email: payload.email.trim(),
              username: payload.username.trim(),
              password: payload.password,
              confirmPassword: payload.confirmPassword,
            },
            { signal: controller.signal },
          );
        } catch (error) {
          if (error instanceof ApiError && isRegisterSuccessMessage(error.message)) {
            return {
              message: REGISTER_SUCCESS_MESSAGE,
            };
          }

          throw error;
        }

        const result = parseRegisterResult(extractRegisterData(response));

        if (!isRegisterSuccessMessage(result.message)) {
          throw new ApiError(
            result.message || "Registration failed. Please try again.",
            500,
            "INVALID_RESPONSE",
          );
        }

        return result;
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
