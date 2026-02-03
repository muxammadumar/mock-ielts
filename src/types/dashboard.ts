// Dashboard type definitions

export interface ProgressDataPoint {
  date: string // Format: "DD MMM" e.g., "12 MAY"
  score: number
  fullDate?: string // ISO date string for sorting
}

export interface SkillScore {
  name: string
  score: number
  icon: string
  color: string
}

export type TimeRange = '6D' | '2W' | '1M' | '6M' | '1Y'

export interface DashboardData {
  progressData: ProgressDataPoint[]
  skillScores: SkillScore[]
  currentScore: number
  currentDate: string // Format: "DD MMM" e.g., "16 MAY"
  scoreBand: number
  points: number
}
