export interface UserProfileDto {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  profileImageUrl: string | null;
}

export interface UpdateUserProfileRequestDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface UpdateUserProfileResponseDto {
  message: string;
}
