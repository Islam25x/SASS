export interface UserProfileDto {
  id?: string;
  userId?: string;
  email?: string;
  mail?: string;
  username?: string;
  userName?: string;
  displayName?: string;
  firstName?: string;
  firstname?: string;
  givenName?: string;
  lastName?: string;
  lastname?: string;
  surname?: string;
  familyName?: string;
  phoneNumber?: string;
  phone?: string;
  mobile?: string;
  dateOfBirth?: string;
  birthDate?: string;
  dob?: string;
  imageUrl?: string;
  profileImageUrl?: string;
  avatarUrl?: string;
  photoUrl?: string;
}

export interface UserProfileDataEnvelopeDto {
  data: UserProfileDto;
}

export interface UserProfileResultEnvelopeDto {
  result: UserProfileDto;
}

export interface UserProfilePayloadEnvelopeDto {
  payload: UserProfileDto;
}

export interface UserProfileUserEnvelopeDto {
  user: UserProfileDto;
}

export interface UserProfileProfileEnvelopeDto {
  profile: UserProfileDto;
}

export type UserProfileResponseDto =
  | UserProfileDto
  | UserProfileDataEnvelopeDto
  | UserProfileResultEnvelopeDto
  | UserProfilePayloadEnvelopeDto
  | UserProfileUserEnvelopeDto
  | UserProfileProfileEnvelopeDto
  | null;
