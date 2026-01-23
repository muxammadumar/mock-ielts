// Global type definitions

export type Locale = 'en' | 'uz' | 'ru'
export type Theme = 'light' | 'dark'

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
