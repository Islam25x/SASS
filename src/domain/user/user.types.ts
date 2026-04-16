export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  imageUrl: string;
}

export type UserProfileResponse = Record<string, unknown> | null;

export interface UpdateUserProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export type UpdateUserProfileResponse = Record<string, unknown> | null;
