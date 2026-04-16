import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { updateUserProfileUseCase } from "../application/user/update-user-profile.usecase";
import type {
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
} from "../domain/user/user.types";
import { ApiError } from "../infrastructure/api/api-error";
import { USER_PROFILE_QUERY_KEY } from "./useUserProfile";

type UpdateUserProfileMutation = UseMutationResult<
  UpdateUserProfileResponse,
  ApiError,
  UpdateUserProfilePayload
>;

type UseUpdateUserProfileResult = UpdateUserProfileMutation & {
  cancel: () => void;
};

export function useUpdateUserProfile(): UseUpdateUserProfileResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<
    UpdateUserProfileResponse,
    ApiError,
    UpdateUserProfilePayload
  >({
    mutationKey: ["user", "profile", "update"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await updateUserProfileUseCase(payload, {
          signal: controller.signal,
        });
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: USER_PROFILE_QUERY_KEY,
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
