import type {
  UpdateUserProfilePayload,
  UpdateUserProfileResponseDto,
} from "../../user/domain/user";
import { updateUserProfileApi } from "../api/user.api";

export async function updateUserProfileUseCase(
  payload: UpdateUserProfilePayload,
  options?: { signal?: AbortSignal },
): Promise<UpdateUserProfileResponseDto> {
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
