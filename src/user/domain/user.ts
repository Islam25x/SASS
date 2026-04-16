export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  profileImageUrl: string;
}

export interface UpdateUserProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface UpdateUserProfileResponseDto {
  message: string;
}
