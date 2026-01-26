// Authentication type definitions

export interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
}

export interface SignInRequest {
  phone: string
  password: string
}

export interface SignUpRequest {
  firstName: string
  lastName: string
  phone: string
  password: string
}

export interface SendOtpRequest {
  phone: string
}

export interface VerifyOtpRequest {
  phone: string
  code: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface OtpResponse {
  success: boolean
  message?: string
}
