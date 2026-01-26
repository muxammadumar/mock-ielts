import { apiClient } from './index'
import type {
  SignInRequest,
  SignUpRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  AuthResponse,
  OtpResponse,
} from '@/types/auth'
import type { ApiResponse } from '@/types'
import { showToast } from 'vant'

export const signIn = async (credentials: SignInRequest): Promise<AuthResponse> => {
  try {
    const response = (await apiClient.post('/auth/signin', credentials)) as unknown as ApiResponse<AuthResponse>
    return response.data
  } catch (error) {
    showToast({
      message: 'Invalid credentials',
      type: 'fail',
    })
    throw error
  }
}

export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
  try {
    const response = (await apiClient.post('/auth/signup', data)) as unknown as ApiResponse<AuthResponse>
    return response.data
  } catch (error) {
    showToast({
      message: 'Failed to create account',
      type: 'fail',
    })
    throw error
  }
}

export const sendOtp = async (request: SendOtpRequest): Promise<OtpResponse> => {
  try {
    const response = (await apiClient.post('/auth/otp/send', request)) as unknown as ApiResponse<OtpResponse>
    return response.data
  } catch (error) {
    showToast({
      message: 'Failed to send code',
      type: 'fail',
    })
    throw error
  }
}

export const verifyOtp = async (request: VerifyOtpRequest): Promise<AuthResponse> => {
  try {
    const response = (await apiClient.post('/auth/otp/verify', request)) as unknown as ApiResponse<AuthResponse>
    return response.data
  } catch (error) {
    showToast({
      message: 'Incorrect code',
      type: 'fail',
    })
    throw error
  }
}

export const signOut = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/signout')
  } catch (error) {
    console.error('Sign out error:', error)
    // Don't show toast on sign out error, just log it
  }
}
