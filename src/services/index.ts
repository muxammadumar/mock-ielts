import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  })

  // Request interceptor
  instance.interceptors.request.use(
    config => {
      // Add auth token if available
      const token = getAuthToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  instance.interceptors.response.use(
    response => {
      return response.data
    },
    error => {
      // Handle error globally
      if (error.response) {
        // Server responded with error status
        console.error('API Error:', error.response.data)
      } else if (error.request) {
        // Request made but no response
        console.error('Network Error:', error.request)
      } else {
        // Something else happened
        console.error('Error:', error.message)
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const apiClient = createAxiosInstance()
