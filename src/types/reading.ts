import type { Question, Answer, QuestionResult, PartResult, QuestionType } from './listening'

export type { Question, Answer, QuestionResult, PartResult, QuestionType }

export interface PassageParagraph {
  label: string
  text: string
}

export interface ReadingPassage {
  title: string
  subtitle?: string
  paragraphs: PassageParagraph[]
}

export interface ReadingTestPart {
  partNumber: number
  title: string
  subtitle: string
  instruction: string
  passage: ReadingPassage
  questions: Question[]
}

export interface ReadingTest {
  id: string
  title: string
  description: string
  totalQuestions: number
  duration: number
  parts: ReadingTestPart[]
  answerKey: Record<number, string | string[]>
}

export interface ReadingTestResult {
  testId: string
  totalQuestions: number
  correctAnswers: number
  score: number
  rawScore: number
  timeSpent: number
  completedAt: string
  partResults: PartResult[]
  questionResults: QuestionResult[]
}

export type ReadingTab = 'passage' | 'questions'
