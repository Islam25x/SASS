import type { UserProfile, UserProfileResponse } from "../../domain/user/user.types";

const EMPTY_USER_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  imageUrl: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function readNestedRecord(source: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  for (const key of keys) {
    const value = source[key];
    if (isRecord(value)) {
      return value;
    }
  }

  return source;
}

export function normalizeUserProfile(response: UserProfileResponse): UserProfile {
  if (!isRecord(response)) {
    return EMPTY_USER_PROFILE;
  }

  const source = readNestedRecord(response, ["data", "result", "payload", "user", "profile"]);
  const firstName = readString(source, ["firstName", "firstname", "givenName"]);
  const lastName = readString(source, ["lastName", "lastname", "surname", "familyName"]);
  const username = readString(source, ["username", "userName", "displayName"]);
  const email = readString(source, ["email", "mail"]);

  return {
    firstName,
    lastName,
    username,
    email,
    phoneNumber: readString(source, ["phoneNumber", "phone", "mobile"]),
    dateOfBirth: readString(source, ["dateOfBirth", "birthDate", "dob"]),
    imageUrl: readString(source, ["imageUrl", "profileImageUrl", "avatarUrl", "photoUrl"]),
  };
}

export function getUserDisplayName(profile: UserProfile): string {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  return fullName || profile.username || "Finexa User";
}

export function getUserInitial(profile: UserProfile): string {
  return getUserDisplayName(profile).charAt(0).toUpperCase() || "F";
}
