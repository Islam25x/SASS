export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponseDto {
  token: string;
  expiresAt: string | null;
  expiresIn: number | null;
}

export interface RegisterResponseDto {
  message: string;
}
