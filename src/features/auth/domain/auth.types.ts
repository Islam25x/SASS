import type { User } from "../../user/domain/user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResult {
  message: string;
}

export interface AuthSession {
  token: string;
  expiresAt: Date;
  user: User;
}
