import { apiClient } from './index'
import type {
  LoginDto,
  RegisterDto,
  VerifyOtpDto,
  ResendDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponse,
  OtpResponse,
  SignInRequest,
  SignUpRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from '@/types/auth'
import { showToast } from 'vant'
import type { AxiosError } from 'axios'

/**
 * Extract error message from API error response
 */
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<AuthResponse | OtpResponse>
    if (axiosError.response?.data) {
      const data = axiosError.response.data
      // Check if response has message field
      if ('message' in data && typeof data.message === 'string') {
        return data.message
      }
      // Check if response has error object
      if ('error' in data && data.error && typeof data.error === 'object' && 'details' in data.error) {
        return String(data.error.details)
      }
    }
  }
  return defaultMessage
}

/**
 * User registration - POST /api/v1/auth/register
 */
export const signUp = async (request: SignUpRequest): Promise<AuthResponse> => {
  try {
    const registerDto: RegisterDto = {
      phone_number: request.phone,
      fullName: request.fullName,
      password: request.password,
    }
    const response = await apiClient.post('/v1/auth/register', registerDto)
    return response as unknown as AuthResponse
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
 * User login - POST /api/v1/auth/login
 */
export const signIn = async (credentials: SignInRequest): Promise<AuthResponse> => {
  try {
    const loginDto: LoginDto = {
      phone_number: credentials.phone,
      password: credentials.password,
    }
    const response = await apiClient.post('/v1/auth/login', loginDto)
    return response as unknown as AuthResponse
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
 * Resend OTP code - POST /api/v1/auth/sms/resend-otp
 */
export const resendOtp = async (request: SendOtpRequest): Promise<OtpResponse> => {
  try {
    const resendDto: ResendDto = {
      code: request.code,
    }
    const response = await apiClient.post('/v1/auth/sms/resend-otp', resendDto)
    return response as unknown as OtpResponse
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to resend code')
    showToast({
      message,
      type: 'fail',
    })
    throw error
  }
}

/**
 * Verify OTP code via SMS - POST /api/v1/auth/sms/verify-otp
 */
export const verifyOtp = async (request: VerifyOtpRequest): Promise<AuthResponse> => {
  try {
    const verifyDto: VerifyOtpDto = {
      otp: request.otp,
      code: request.code,
    }
    const response = await apiClient.post('/v1/auth/sms/verify-otp', verifyDto)
    return response as unknown as AuthResponse
  } catch (error) {
    const message = getErrorMessage(error, 'Incorrect verification code')
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
      refresh_token: refreshToken,
    }
    const response = await apiClient.post('/v1/auth/refresh', refreshDto)
    return response as unknown as AuthResponse
  } catch (error) {
    console.error('Refresh tokens error:', error)
    throw error
  }
}

/**
 * Request password reset - POST /api/v1/auth/password/forgot
 */
export const forgotPassword = async (email: string): Promise<OtpResponse> => {
  try {
    const forgotDto: ForgotPasswordDto = {
      email,
    }
    const response = await apiClient.post('/v1/auth/password/forgot', forgotDto)
    showToast({
      message: 'Password reset code sent to your email',
      type: 'success',
    })
    return response as unknown as OtpResponse
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to send reset code')
    showToast({
      message,
      type: 'fail',
    })
    throw error
  }
}

/**
 * Reset password - POST /api/v1/auth/password/reset
 */
export const resetPassword = async (otp: string, code: string, newPassword: string): Promise<AuthResponse> => {
  try {
    const resetDto: ResetPasswordDto = {
      otp,
      code,
      newPassword,
    }
    const response = await apiClient.post('/v1/auth/password/reset', resetDto)
    showToast({
      message: 'Password reset successfully',
      type: 'success',
    })
    return response as unknown as AuthResponse
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to reset password')
    showToast({
      message,
      type: 'fail',
    })
    throw error
  }
}
