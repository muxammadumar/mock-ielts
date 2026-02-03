import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios'

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
      // Return response.data directly (unwrapped)
      return response.data
    },
    async (error: AxiosError) => {
      // Handle error globally
      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const data = error.response.data

        // Handle 401 Unauthorized - token expired
        if (status === 401) {
          // Clear auth and redirect to login
          // Note: Token refresh logic can be added here if needed
          const authToken = getAuthToken()
          if (authToken) {
            // Token expired, clear it
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_refresh_token')
            localStorage.removeItem('auth_user')
            
            // Redirect to login if not already there
            if (window.location.pathname !== '/auth/signin') {
              window.location.href = '/auth/signin'
            }
          }
        }

        console.error('API Error:', {
          status,
          data,
          url: error.config?.url,
        })
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
