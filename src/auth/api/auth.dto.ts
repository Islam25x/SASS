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

export interface LoginTokenDto {
  token?: string;
  accessToken?: string;
  jwt?: string;
  jwtToken?: string;
  expiresAt?: string;
  expiresIn?: number;
}

export interface RegisterResultDto {
  message?: string;
}

export interface LoginDataEnvelopeDto {
  data: LoginTokenDto;
}

export interface LoginResultEnvelopeDto {
  result: LoginTokenDto;
}

export interface LoginPayloadEnvelopeDto {
  payload: LoginTokenDto;
}

export interface LoginUserEnvelopeDto {
  user: LoginTokenDto;
}

export type LoginResponseDto =
  | string
  | LoginTokenDto
  | LoginDataEnvelopeDto
  | LoginResultEnvelopeDto
  | LoginPayloadEnvelopeDto
  | LoginUserEnvelopeDto;

export interface RegisterDataEnvelopeDto {
  data: RegisterResultDto;
}

export interface RegisterResultEnvelopeDto {
  result: RegisterResultDto;
}

export interface RegisterPayloadEnvelopeDto {
  payload: RegisterResultDto;
}

export type RegisterResponseDto =
  | RegisterResultDto
  | RegisterDataEnvelopeDto
  | RegisterResultEnvelopeDto
  | RegisterPayloadEnvelopeDto
  | null;
