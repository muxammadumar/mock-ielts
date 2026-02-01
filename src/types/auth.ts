// Authentication type definitions

export interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
}

// RegisterDto - matches API /api/v1/auth/register
export interface RegisterDto {
  firstName: string
  lastName: string
  phone: string
  password: string
}

// LoginDto - matches API /api/v1/auth/login
export interface LoginDto {
  phone: string
  password: string
}

// VerifyOtpDto - matches API /api/v1/auth/email/verify-otp
// Note: Using phone number in email field as per plan
export interface VerifyOtpDto {
  email: string // Will contain phone number
  code: string
}

// ResendDto - matches API /api/v1/auth/email/resend-otp
// Note: Using phone number in email field as per plan
export interface ResendDto {
  email: string // Will contain phone number
}

// RefreshTokenDto - matches API /api/v1/auth/refresh
export interface RefreshTokenDto {
  refreshToken: string
}

// AuthResponse - API response structure (may vary, handling both formats)
export interface AuthResponse {
  accessToken?: string
  refreshToken?: string
  token?: string // Fallback for older format
  user?: User
  // Direct user fields if API returns them directly
  id?: string
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
}

// OTP Response
export interface OtpResponse {
  success?: boolean
  message?: string
  // API may return different structure
  [key: string]: unknown
}

// Legacy request types (keeping for backward compatibility)
export interface SignInRequest extends LoginDto {}
export interface SignUpRequest extends RegisterDto {}
export interface SendOtpRequest {
  phone: string
}
export interface VerifyOtpRequest {
  phone: string
  code: string
}
