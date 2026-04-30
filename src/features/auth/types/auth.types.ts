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

export interface ConfirmEmailPayload {
  userId: string;
  token: string;
}

export interface ResendConfirmationPayload {
  email: string;
}

export interface ResendConfirmationResult {
  message: string;
}

export interface AuthSession {
  token: string;
  expiresAt: Date;
}
