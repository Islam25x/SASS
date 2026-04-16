export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type RegisterResponse = {
  message?: string;
  [key: string]: unknown;
} | null;

export type LoginResponse = Record<string, unknown> | string | null;

export interface AuthSession {
  token: string;
  email?: string;
  username?: string;
  raw?: LoginResponse;
}
