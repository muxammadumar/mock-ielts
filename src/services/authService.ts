import { apiClient } from './index'
import type {
  LoginDto,
  RegisterDto,
  VerifyOtpDto,
  ResendDto,
  RefreshTokenDto,
  AuthResponse,
  OtpResponse,
  SignInRequest,
  SignUpRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from '@/types/auth'
import type { ApiResponse } from '@/types'
import { showToast } from 'vant'
import type { AxiosError } from 'axios'

/**
 * Extract error message from API error response
 */
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>
    if (axiosError.response?.data) {
      return (
        axiosError.response.data.message ||
        axiosError.response.data.error ||
        axiosError.response.statusText ||
        defaultMessage
      )
    }
  }
  return defaultMessage
}

/**
 * Extract data from API response (handles both wrapped and direct formats)
 */
const extractResponseData = <T>(response: unknown): T => {
  // If response is already the data (direct format)
  if (response && typeof response === 'object' && 'accessToken' in response) {
    return response as T
  }
  // If response is wrapped in ApiResponse format
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data
  }
  // Fallback: return response as-is
  return response as T
}

/**
 * User login - POST /api/v1/auth/login
 */
export const signIn = async (credentials: SignInRequest): Promise<AuthResponse> => {
  try {
    const loginDto: LoginDto = {
      phone: credentials.phone,
      password: credentials.password,
    }
    const response = await apiClient.post('/v1/auth/login', loginDto)
    const data = extractResponseData<AuthResponse>(response)
    console.log('Login response:', data) // Log for debugging
    return data
  } catch (error) {
    const message = getErrorMessage(error, 'Invalid credentials')
    showToast({
      message,
      type: 'fail',
    })
    throw error
  }
}

/**
 * User registration - POST /api/v1/auth/register
 */
export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
  try {
    const registerDto: RegisterDto = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      password: data.password,
    }
    const response = await apiClient.post('/v1/auth/register', registerDto)
    const authData = extractResponseData<AuthResponse>(response)
    console.log('Register response:', authData) // Log for debugging
    return authData
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to create account')
    showToast({
      message,
      type: 'fail',
    })
    throw error
  }
}

/**
 * Resend OTP code - POST /api/v1/auth/email/resend-otp
 * Note: Sending phone number in email field as per API requirement
 */
export const sendOtp = async (request: SendOtpRequest): Promise<OtpResponse> => {
  try {
    const resendDto: ResendDto = {
      email: request.phone, // Using phone in email field
    }
    const response = await apiClient.post('/v1/auth/email/resend-otp', resendDto)
    const data = extractResponseData<OtpResponse>(response)
    console.log('Resend OTP response:', data) // Log for debugging
    return data
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to send code')
    showToast({
      message,
      type: 'fail',
    })
    throw error
  }
}

/**
 * Verify OTP code - POST /api/v1/auth/email/verify-otp
 * Note: Sending phone number in email field as per API requirement
 */
export const verifyOtp = async (request: VerifyOtpRequest): Promise<AuthResponse> => {
  try {
    const verifyDto: VerifyOtpDto = {
      email: request.phone, // Using phone in email field
      code: request.code,
    }
    const response = await apiClient.post('/v1/auth/email/verify-otp', verifyDto)
    const data = extractResponseData<AuthResponse>(response)
    console.log('Verify OTP response:', data) // Log for debugging
    return data
  } catch (error) {
    const message = getErrorMessage(error, 'Incorrect code')
    showToast({
      message,
      type: 'fail',
    })
    throw error
  }
}

/**
 * User logout - POST /api/v1/auth/logout
 */
export const signOut = async (): Promise<void> => {
  try {
    await apiClient.post('/v1/auth/logout')
  } catch (error) {
    console.error('Sign out error:', error)
    // Don't show toast on sign out error, just log it
  }
}

/**
 * Refresh access token - POST /api/v1/auth/refresh
 */
export const refreshTokens = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const refreshDto: RefreshTokenDto = {
      refreshToken,
    }
    const response = await apiClient.post('/v1/auth/refresh', refreshDto)
    const data = extractResponseData<AuthResponse>(response)
    console.log('Refresh tokens response:', data) // Log for debugging
    return data
  } catch (error) {
    console.error('Refresh tokens error:', error)
    throw error
  }
}
