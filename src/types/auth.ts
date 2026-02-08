// Authentication type definitions

export interface User {
  id: string
  fullName: string
  phone_number: string
  email?: string
  roles?: string[]
  permissions?: string[]
}

// API Request DTOs - matching backend OpenAPI schema

// RegisterDto - POST /api/v1/auth/register
export interface RegisterDto {
  phone_number: string
  fullName: string
  password: string
}

// LoginDto - POST /api/v1/auth/login
export interface LoginDto {
  phone_number: string
  password: string
}

// VerifyOtpDto - POST /api/v1/auth/email/verify-otp or /api/v1/auth/sms/verify-otp
export interface VerifyOtpDto {
  otp: string
  code: string
}

// ResendDto - POST /api/v1/auth/email/resend-otp or /api/v1/auth/sms/resend-otp
export interface ResendDto {
  code: string
}

// RefreshTokenDto - POST /api/v1/auth/refresh
export interface RefreshTokenDto {
  refresh_token: string
}

// ForgotPasswordDto - POST /api/v1/auth/password/forgot
export interface ForgotPasswordDto {
  email: string
}

// ResetPasswordDto - POST /api/v1/auth/password/reset
export interface ResetPasswordDto {
  otp: string
  code: string
  newPassword: string
}

// API Response types

export interface AuthResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    code: string
    accessToken: string
    refreshToken: string
    user: User
  }
  error: null | {
    code: string
    details: string
  }
  meta: {
    timestamp: string
    path: string
  }
}

export interface OtpResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    code: string
    expiresAt?: string
  }
  error: null | {
    code: string
    details: string
  }
  meta: {
    timestamp: string
    path: string
  }
}

// Frontend-friendly request types
export interface SignInRequest {
  phone: string
  password: string
}

export interface SignUpRequest {
  fullName: string
  phone: string
  password: string
}

export interface SendOtpRequest {
  code: string
}

export interface VerifyOtpRequest {
  code: string
  otp: string
}
