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
    return saved ? JSON.parse(saved) : null
  }
  const user = ref<User | null>(getInitialUser())

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  /**
   * Extract user data from AuthResponse (handles different response formats)
   */
  const extractUser = (response: AuthResponse): User => {
    // If user object is provided directly
    if (response.user) {
      return response.user
    }
    // If user fields are at root level
    if (response.id && response.firstName && response.lastName) {
      return {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        phone: response.phone || '',
        email: response.email,
      }
    }
    // Fallback: return current user or create minimal user
    return user.value || {
      id: '',
      firstName: '',
      lastName: '',
      phone: '',
    }
  }

  /**
   * Extract access token from AuthResponse (handles different response formats)
   */
  const extractAccessToken = (response: AuthResponse): string => {
    return response.accessToken || response.token || ''
  }

  /**
   * Set authentication data (tokens and user)
   */
  const setAuth = (authResponse: AuthResponse) => {
    const accessToken = extractAccessToken(authResponse)
    const userData = extractUser(authResponse)

    token.value = accessToken
    user.value = userData
    localStorage.setItem(TOKEN_KEY, accessToken)

    if (authResponse.refreshToken) {
      refreshToken.value = authResponse.refreshToken
      localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken)
    }

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
   * Send OTP code
   */
  const sendOtp = async (request: SendOtpRequest) => {
    return await authService.sendOtp(request)
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

    if (savedToken && savedUser) {
      token.value = savedToken
      if (savedRefreshToken) {
        refreshToken.value = savedRefreshToken
      }
      user.value = JSON.parse(savedUser)
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
    sendOtp,
    verifyOtp,
    signOut,
    refreshTokens,
    checkAuth,
  }
})
