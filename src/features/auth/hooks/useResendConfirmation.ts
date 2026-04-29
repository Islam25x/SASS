import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { useToast } from "../../../shared/ui";
import { extractRegisterData, parseRegisterResult } from "../utils/auth.parser";
import { resendConfirmationApi } from "../api/resend-confirmation.api";
import type {
  ResendConfirmationPayload,
  ResendConfirmationResult,
} from "../types/auth.types";

const RESEND_CONFIRMATION_SUCCESS_MESSAGE = "A new confirmation email has been sent";

type ResendConfirmationMutation = UseMutationResult<
  ResendConfirmationResult,
  ApiError,
  ResendConfirmationPayload
>;

type UseResendConfirmationResult = ResendConfirmationMutation & {
  cancel: () => void;
};

export function useResendConfirmation(): UseResendConfirmationResult {
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<
    ResendConfirmationResult,
    ApiError,
    ResendConfirmationPayload
  >({
    mutationKey: ["auth", "resend-confirmation"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await resendConfirmationApi(
          {
            email: payload.email.trim(),
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
    onSuccess: (_result, payload) => {
      showToast({
        id: `resend-confirmation:${payload.email.trim().toLowerCase()}`,
        message: RESEND_CONFIRMATION_SUCCESS_MESSAGE,
        tone: "success",
      });
    },
    onError: (error, payload) => {
      showToast({
        id: `resend-confirmation:error:${payload.email.trim().toLowerCase()}`,
        message: error.message,
        tone: "error",
      });
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
