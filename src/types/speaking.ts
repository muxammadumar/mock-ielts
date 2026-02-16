export interface SpeakingQuestion {
  id: number
  questionNumber: number
  topic: string
  question: string
}

export interface SpeakingPart {
  partNumber: number
  title: string
  questions: SpeakingQuestion[]
}

export interface SpeakingTest {
  id: string
  title: string
  duration: number
  parts: SpeakingPart[]
  totalQuestions: number
}

export interface SpeakingAnswer {
  questionId: number
  audioBlob: Blob | null
}

export interface SpeakingTestResult {
  testId: string
  questionsAnswered: number
  timeSpent: number
  completedAt: string
}

export type RecordingState = 'idle' | 'recording' | 'paused'
