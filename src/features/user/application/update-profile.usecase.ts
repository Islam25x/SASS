import { updateUserProfileApi } from "../api/user.api";
import type { UpdateUserProfileRequestDto } from "../api/user.dto";

export interface UpdateUserProfileInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

function mapInputToRequestDto(input: UpdateUserProfileInput): UpdateUserProfileRequestDto {
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phoneNumber: input.phoneNumber.trim(),
    dateOfBirth: input.dateOfBirth,
  };
}

export async function updateUserProfileUseCase(
  input: UpdateUserProfileInput,
  options?: { signal?: AbortSignal },
): Promise<void> {
  await updateUserProfileApi(mapInputToRequestDto(input), options);
}
