import type {
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
} from "../../domain/user/user.types";
import { updateUserProfileApi } from "../../infrastructure/api/user.api";

export async function updateUserProfileUseCase(
  payload: UpdateUserProfilePayload,
  options?: { signal?: AbortSignal },
): Promise<UpdateUserProfileResponse> {
  return updateUserProfileApi(
    {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      phoneNumber: payload.phoneNumber.trim(),
      dateOfBirth: payload.dateOfBirth,
    },
    options,
  );
}
