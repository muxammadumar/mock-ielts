import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  User,
  SignInRequest,
  SignUpRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  AuthResponse,
} from '@/types/auth'
import * as authService from '@/services/authService'

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
  const getInitialUser = (): User | null => {
    const saved = localStorage.getItem(USER_KEY)
    if (!saved || saved === 'undefined' || saved === 'null') {
      return null
    }
    try {
      return JSON.parse(saved)
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error)
      return null
    }
  }
  const user = ref<User | null>(getInitialUser())

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  /**
   * Set authentication data (tokens and user)
   */
  const setAuth = (authResponse: AuthResponse) => {
    if (!authResponse.success || !authResponse.data) {
      throw new Error(authResponse.message || 'Authentication failed')
    }

    const { accessToken, refreshToken: newRefreshToken, user: userData } = authResponse.data

    token.value = accessToken
    user.value = userData
    refreshToken.value = newRefreshToken

    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  /**
   * Clear authentication data
   */
  const clearAuth = () => {
    token.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  /**
   * User sign in
   */
  const signIn = async (credentials: SignInRequest) => {
    const response = await authService.signIn(credentials)
    setAuth(response)
    return response
  }

  /**
   * User sign up
   */
  const signUp = async (data: SignUpRequest) => {
    const response = await authService.signUp(data)
    setAuth(response)
    return response
  }

  /**
   * Resend OTP code
   */
  const resendOtp = async (request: SendOtpRequest) => {
    return await authService.resendOtp(request)
  }

  /**
   * Verify OTP code
   */
  const verifyOtp = async (request: VerifyOtpRequest) => {
    const response = await authService.verifyOtp(request)
    setAuth(response)
    return response
  }

  /**
   * User sign out
   */
  const signOut = async () => {
    try {
      await authService.signOut()
    } finally {
      clearAuth()
    }
  }

  /**
   * Refresh access token using refresh token
   */
  const refreshTokens = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }
    const response = await authService.refreshTokens(refreshToken.value)
    setAuth(response)
    return response
  }

  /**
   * Check and restore authentication from localStorage
   */
  const checkAuth = () => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)

    if (savedToken && savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        token.value = savedToken
        if (savedRefreshToken && savedRefreshToken !== 'undefined' && savedRefreshToken !== 'null') {
          refreshToken.value = savedRefreshToken
        }
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Failed to restore auth from localStorage:', error)
        clearAuth()
      }
    } else {
      clearAuth()
    }
  }

  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    signIn,
    signUp,
    resendOtp,
    verifyOtp,
    signOut,
    refreshTokens,
    checkAuth,
  }
})
