import type { UserProfileDto } from "../api/user.dto";
import type { User } from "../types/user.types";
import {
  createInvalidResponseError,
  isObject,
  safeTrim,
  toTrimmedString,
} from "../../../shared/utils/mapper.utils";
import { normalizeProfileImageUrl } from "../../../shared/utils/profile-image-url";

interface EnvelopeCandidate {
  data?: unknown;
  result?: unknown;
  payload?: unknown;
  user?: unknown;
  profile?: unknown;
}

interface RawUserCandidate {
  id?: unknown;
  userId?: unknown;
  email?: unknown;
  mail?: unknown;
  username?: unknown;
  userName?: unknown;
  displayName?: unknown;
  firstName?: unknown;
  firstname?: unknown;
  givenName?: unknown;
  lastName?: unknown;
  lastname?: unknown;
  surname?: unknown;
  familyName?: unknown;
  phoneNumber?: unknown;
  phone?: unknown;
  mobile?: unknown;
  dateOfBirth?: unknown;
  birthDate?: unknown;
  dob?: unknown;
  imageUrl?: unknown;
  profileImageUrl?: unknown;
  avatarUrl?: unknown;
  photoUrl?: unknown;
}

type ParseUserOptions = {
  profileImageCacheKey?: string | number | null;
};

function unwrapEnvelope(response: unknown): unknown {
  if (!isObject(response)) {
    return response;
  }

  const candidate = response as EnvelopeCandidate;
  return (
    candidate.data ??
    candidate.result ??
    candidate.payload ??
    candidate.user ??
    candidate.profile ??
    response
  );
}

export function extractUserData(response: unknown): unknown {
  return unwrapEnvelope(response);
}

function readFirstPresentString(
  source: RawUserCandidate,
  keys: Array<keyof RawUserCandidate>,
): string {
  for (const key of keys) {
    const value = toTrimmedString(source[key]);
    if (value) {
      return value;
    }
  }

  return "";
}

function parseUserProfileDto(data: unknown): UserProfileDto {
  if (!isObject(data)) {
    throw createInvalidResponseError(
      "INVALID_USER_RESPONSE",
      "User response payload is not a valid object.",
    );
  }

  const candidate = data as RawUserCandidate;
  return {
    id: readFirstPresentString(candidate, ["id", "userId"]),
    email: readFirstPresentString(candidate, ["email", "mail"]),
    userName: readFirstPresentString(candidate, ["userName", "username"]),
    firstName: readFirstPresentString(candidate, ["firstName", "firstname", "givenName"]),
    lastName: readFirstPresentString(candidate, ["lastName", "lastname", "familyName", "surname"]),
    phoneNumber: readFirstPresentString(candidate, ["phoneNumber", "phone", "mobile"]),
    dateOfBirth:
      toTrimmedString(candidate.dateOfBirth) ??
      toTrimmedString(candidate.birthDate) ??
      toTrimmedString(candidate.dob),
    profileImageUrl:
      toTrimmedString(candidate.profileImageUrl) ??
      toTrimmedString(candidate.imageUrl) ??
      toTrimmedString(candidate.avatarUrl) ??
      toTrimmedString(candidate.photoUrl),
  };
}

function parseDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createInvalidResponseError(
      "INVALID_DATE_OF_BIRTH",
      "User profile contains an invalid date of birth value.",
      { value },
    );
  }

  return date;
}

function requireUserField(field: "id" | "email" | "username", value: string): string {
  if (!value) {
    throw createInvalidResponseError(
      "INVALID_USER_DATA",
      `User data is invalid: missing required field "${field}".`,
    );
  }

  return value;
}

export function parseUser(data: unknown, options?: ParseUserOptions): User {
  const dto = parseUserProfileDto(data);

  const id = requireUserField("id", safeTrim(dto.id));
  const email = requireUserField("email", safeTrim(dto.email));
  const username = requireUserField("username", safeTrim(dto.userName));

  return {
    id,
    email,
    username,
    firstName: safeTrim(dto.firstName),
    lastName: safeTrim(dto.lastName),
    phoneNumber: safeTrim(dto.phoneNumber),
    dateOfBirth: parseDate(dto.dateOfBirth),
    profileImageUrl: dto.profileImageUrl
      ? normalizeProfileImageUrl(dto.profileImageUrl, {
          cacheKey: options?.profileImageCacheKey,
        })
      : null,
  };
}
