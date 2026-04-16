import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { registerUseCase } from "../auth/application/register.usecase";
import type { RegisterResponseDto } from "../auth/api/auth.dto";
import type { RegisterPayload } from "../auth/domain/auth.types";
import { ApiError } from "../infrastructure/api/api-error";

type RegisterMutation = UseMutationResult<
  RegisterResponseDto,
  ApiError,
  RegisterPayload
>;

type UseRegisterResult = RegisterMutation & {
  cancel: () => void;
};

export function useRegister(): UseRegisterResult {
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<RegisterResponseDto, ApiError, RegisterPayload>({
    mutationKey: ["auth", "register"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await registerUseCase(payload, { signal: controller.signal });
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
