import type { User } from "../domain/user";

export function getUserDisplayName(user: User): string {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  return fullName || user.username || "Finexa User";
}

export function getUserInitial(user: User): string {
  return getUserDisplayName(user).charAt(0).toUpperCase() || "F";
}
