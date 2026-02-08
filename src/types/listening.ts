export type QuestionType = 'fill-in-blank' | 'multiple-choice' | 'true-false-ng'

export type AudioControlMode = 'practice' | 'exam'

export interface BaseQuestion {
  id: number
  type: QuestionType
  question: string
  correctAnswer: string | string[]
  acceptableAnswers?: string[][] // For fill-in-blank variations
}

export interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill-in-blank'
  blanks: number // number of blank fields
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice'
  options: { value: string; label: string }[] // e.g., [{value: 'A', label: 'Option text'}]
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false-ng'
  // Answer options: True, False, Not Given
}

export type Question = FillInBlankQuestion | MultipleChoiceQuestion | TrueFalseQuestion

export interface TestPart {
  partNumber: number
  title: string // e.g., "PART 1"
  subtitle: string // e.g., "QUESTIONS 1-10"
  questions: Question[]
  audioStartTime?: number // Optional: timestamp when this part starts in the audio
  audioEndTime?: number // Optional: timestamp when this part ends
}

export interface ListeningTest {
  id: string
  title: string
  description: string
  totalQuestions: number
  duration: number // in minutes (40 mins test + 10 mins transfer)
  testDuration: number // 40 mins for test
  transferDuration: number // 10 mins for transfer
  parts: TestPart[]
  audioUrl: string
  audioControlMode: AudioControlMode
  answerKey: Record<number, string | string[]>
}

export interface Answer {
  questionId: number
  value: string | string[] // string for single answer, string[] for multiple blanks
}

export interface ListeningTestState {
  currentPartIndex: number
  answers: Record<number, Answer>
  isPlaying: boolean
  currentTime: number
  duration: number
  timeRemaining: number // in seconds
}

export interface QuestionResult {
  questionId: number
  userAnswer: string | string[]
  correctAnswer: string | string[]
  isCorrect: boolean
  questionType: QuestionType
}

export interface PartResult {
  partNumber: number
  totalQuestions: number
  correctAnswers: number
}

export interface ListeningTestResult {
  testId: string
  totalQuestions: number
  correctAnswers: number
  score: number // IELTS band (0-9)
  rawScore: number // Number correct out of 40
  timeSpent: number // Seconds
  completedAt: string
  partResults: PartResult[]
  questionResults: QuestionResult[]
}
