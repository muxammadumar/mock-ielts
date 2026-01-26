import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, SignInRequest, SignUpRequest, SendOtpRequest, VerifyOtpRequest } from '@/types/auth'
import * as authService from '@/services/authService'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  })

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setAuth = (authToken: string, userData: User) => {
    token.value = authToken
    user.value = userData
    localStorage.setItem(TOKEN_KEY, authToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const signIn = async (credentials: SignInRequest) => {
    const response = await authService.signIn(credentials)
    setAuth(response.token, response.user)
    return response
  }

  const signUp = async (data: SignUpRequest) => {
    const response = await authService.signUp(data)
    setAuth(response.token, response.user)
    return response
  }

  const sendOtp = async (request: SendOtpRequest) => {
    return await authService.sendOtp(request)
  }

  const verifyOtp = async (request: VerifyOtpRequest) => {
    const response = await authService.verifyOtp(request)
    setAuth(response.token, response.user)
    return response
  }

  const signOut = async () => {
    try {
      await authService.signOut()
    } finally {
      clearAuth()
    }
  }

  const checkAuth = () => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    } else {
      clearAuth()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    signIn,
    signUp,
    sendOtp,
    verifyOtp,
    signOut,
    checkAuth,
  }
})
