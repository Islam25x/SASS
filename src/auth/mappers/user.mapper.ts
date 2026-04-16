import type { UserProfileResponseDto, UserProfileDto } from "../api/user.dto";
import type { User } from "../../user/domain/user";

const EMPTY_USER: User = {
  id: "",
  email: "",
  username: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  dateOfBirth: null,
  profileImageUrl: "",
};

function isUserProfileDataEnvelopeDto(
  value: UserProfileResponseDto,
): value is { data: UserProfileDto } {
  return value !== null && typeof value === "object" && "data" in value;
}

function isUserProfileResultEnvelopeDto(
  value: UserProfileResponseDto,
): value is { result: UserProfileDto } {
  return value !== null && typeof value === "object" && "result" in value;
}

function isUserProfilePayloadEnvelopeDto(
  value: UserProfileResponseDto,
): value is { payload: UserProfileDto } {
  return value !== null && typeof value === "object" && "payload" in value;
}

function isUserProfileUserEnvelopeDto(
  value: UserProfileResponseDto,
): value is { user: UserProfileDto } {
  return value !== null && typeof value === "object" && "user" in value;
}

function isUserProfileProfileEnvelopeDto(
  value: UserProfileResponseDto,
): value is { profile: UserProfileDto } {
  return value !== null && typeof value === "object" && "profile" in value;
}

function unwrapUserProfileDto(response: UserProfileResponseDto): UserProfileDto | null {
  if (response === null) {
    return null;
  }

  if (isUserProfileDataEnvelopeDto(response)) {
    return response.data;
  }

  if (isUserProfileResultEnvelopeDto(response)) {
    return response.result;
  }

  if (isUserProfilePayloadEnvelopeDto(response)) {
    return response.payload;
  }

  if (isUserProfileUserEnvelopeDto(response)) {
    return response.user;
  }

  if (isUserProfileProfileEnvelopeDto(response)) {
    return response.profile;
  }

  return response;
}

function normalizeString(value: string | undefined): string {
  return value?.trim() ?? "";
}

function firstDefinedString(...values: Array<string | undefined>): string {
  for (const value of values) {
    const normalizedValue = normalizeString(value);
    if (normalizedValue) {
      return normalizedValue;
    }
  }

  return "";
}

function parseDate(value: string | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function mapProfileToUser(response: UserProfileResponseDto): User {
  const dto = unwrapUserProfileDto(response);
  if (!dto) {
    return EMPTY_USER;
  }

  return {
    id: firstDefinedString(dto.id, dto.userId),
    email: firstDefinedString(dto.email, dto.mail),
    username: firstDefinedString(dto.username, dto.userName, dto.displayName),
    firstName: firstDefinedString(dto.firstName, dto.firstname, dto.givenName),
    lastName: firstDefinedString(dto.lastName, dto.lastname, dto.surname, dto.familyName),
    phoneNumber: firstDefinedString(dto.phoneNumber, dto.phone, dto.mobile),
    dateOfBirth: parseDate(firstDefinedString(dto.dateOfBirth, dto.birthDate, dto.dob)),
    profileImageUrl: firstDefinedString(
      dto.imageUrl,
      dto.profileImageUrl,
      dto.avatarUrl,
      dto.photoUrl,
    ),
  };
}

export function getUserDisplayName(user: User): string {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  return fullName || user.username || "Finexa User";
}

export function getUserInitial(user: User): string {
  return getUserDisplayName(user).charAt(0).toUpperCase() || "F";
}
