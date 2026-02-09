import type {
  ListeningTest,
  ListeningTestResult,
  Answer,
  Question,
  PartResult,
  QuestionResult,
} from '@/types/listening'
import type { ReadingTest, ReadingTestResult } from '@/types/reading'

/**
 * Normalize answer string for comparison
 * - Convert to lowercase
 * - Trim whitespace
 * - Replace multiple spaces with single space
 */
export const normalizeAnswer = (answer: string): string => {
  return answer.toLowerCase().trim().replace(/\s+/g, ' ')
}

/**
 * Validate user answer against correct answer
 * Handles:
 * - Single answers (multiple choice, true/false)
 * - Fill-in-blank with variations
 * - Multiple blanks (array answers)
 * - Case-insensitive comparison
 */
export const validateAnswer = (
  userAnswer: string | string[] | undefined,
  correctAnswer: string | string[],
  acceptableAnswers?: string[][]
): boolean => {
  // Handle unanswered questions
  if (!userAnswer || userAnswer === '' || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
    return false
  }

  // Handle array answers (multiple blanks)
  if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
    if (userAnswer.length !== correctAnswer.length) return false

    return userAnswer.every((ans, index) => {
      const normalized = normalizeAnswer(ans)
      const correct = normalizeAnswer(correctAnswer[index] as string)

      if (normalized === correct) return true

      // Check acceptable variations for this blank
      if (acceptableAnswers?.[index]) {
        return acceptableAnswers[index].some((acceptable) => normalizeAnswer(acceptable) === normalized)
      }

      return false
    })
  }

  // Handle single answers (string)
  const normalized = normalizeAnswer(userAnswer as string)
  const correct = normalizeAnswer(correctAnswer as string)

  if (normalized === correct) return true

  // Check acceptable variations
  if (acceptableAnswers?.[0]) {
    return acceptableAnswers[0].some((acceptable) => normalizeAnswer(acceptable) === normalized)
  }

  return false
}

/**
 * Calculate raw score (number of correct answers)
 */
export const calculateRawScore = (
  answers: Record<number, Answer>,
  questions: Question[]
): number => {
  let correctCount = 0

  questions.forEach((question) => {
    const userAnswer = answers[question.id]?.value
    const isCorrect = validateAnswer(userAnswer, question.correctAnswer, question.acceptableAnswers)

    if (isCorrect) {
      correctCount++
    }
  })

  return correctCount
}

/**
 * Convert raw score to IELTS band score (0-9 scale)
 * Based on IELTS listening band score conversion table
 */
export const calculateBandScore = (rawScore: number, totalQuestions: number = 40): number => {
  if (totalQuestions !== 40) {
    // If not standard 40 questions, calculate proportionally
    const percentage = (rawScore / totalQuestions) * 100
    if (percentage >= 97.5) return 9.0
    if (percentage >= 92.5) return 8.5
    if (percentage >= 87.5) return 8.0
    if (percentage >= 82.5) return 7.5
    if (percentage >= 75) return 7.0
    if (percentage >= 67.5) return 6.5
    if (percentage >= 57.5) return 6.0
    if (percentage >= 50) return 5.5
    if (percentage >= 40) return 5.0
    if (percentage >= 30) return 4.5
    if (percentage >= 23) return 4.0
    return 3.5
  }

  // Standard IELTS listening band conversion (for 40 questions)
  if (rawScore >= 39) return 9.0 // 39-40 correct
  if (rawScore >= 37) return 8.5 // 37-38 correct
  if (rawScore >= 35) return 8.0 // 35-36 correct
  if (rawScore >= 33) return 7.5 // 33-34 correct
  if (rawScore >= 30) return 7.0 // 30-32 correct
  if (rawScore >= 27) return 6.5 // 27-29 correct
  if (rawScore >= 23) return 6.0 // 23-26 correct
  if (rawScore >= 20) return 5.5 // 20-22 correct
  if (rawScore >= 16) return 5.0 // 16-19 correct
  if (rawScore >= 13) return 4.5 // 13-15 correct
  if (rawScore >= 10) return 4.0 // 10-12 correct
  if (rawScore >= 6) return 3.5 // 6-9 correct
  if (rawScore >= 4) return 3.0 // 4-5 correct
  if (rawScore >= 3) return 2.5 // 3 correct
  return 2.0 // 0-2 correct
}

/**
 * Calculate part-specific results
 */
const calculatePartResults = (
  testData: ListeningTest,
  answers: Record<number, Answer>
): PartResult[] => {
  return testData.parts.map((part) => {
    let correctAnswers = 0

    part.questions.forEach((question) => {
      const userAnswer = answers[question.id]?.value
      const isCorrect = validateAnswer(userAnswer, question.correctAnswer, question.acceptableAnswers)
      if (isCorrect) correctAnswers++
    })

    return {
      partNumber: part.partNumber,
      totalQuestions: part.questions.length,
      correctAnswers,
    }
  })
}

/**
 * Generate question-by-question results
 */
const generateQuestionResults = (
  testData: ListeningTest,
  answers: Record<number, Answer>
): QuestionResult[] => {
  const results: QuestionResult[] = []

  testData.parts.forEach((part) => {
    part.questions.forEach((question) => {
      const userAnswer = answers[question.id]?.value || ''
      const isCorrect = validateAnswer(userAnswer, question.correctAnswer, question.acceptableAnswers)

      results.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        questionType: question.type,
      })
    })
  })

  return results
}

/**
 * Generate complete test result
 * Main function to create full result object after test submission
 */
export const generateTestResult = (
  testData: ListeningTest,
  answers: Record<number, Answer>,
  timeSpent: number
): ListeningTestResult => {
  // Get all questions from all parts
  const allQuestions: Question[] = testData.parts.flatMap((part) => part.questions)

  // Calculate raw score
  const rawScore = calculateRawScore(answers, allQuestions)

  // Calculate band score
  const bandScore = calculateBandScore(rawScore, testData.totalQuestions)

  // Calculate part results
  const partResults = calculatePartResults(testData, answers)

  // Generate question results
  const questionResults = generateQuestionResults(testData, answers)

  return {
    testId: testData.id,
    totalQuestions: testData.totalQuestions,
    correctAnswers: rawScore,
    score: bandScore,
    rawScore,
    timeSpent,
    completedAt: new Date().toISOString(),
    partResults,
    questionResults,
  }
}

/**
 * Generate complete reading test result
 */
export const generateReadingTestResult = (
  testData: ReadingTest,
  answers: Record<number, Answer>,
  timeSpent: number
): ReadingTestResult => {
  const allQuestions: Question[] = testData.parts.flatMap((part) => part.questions)
  const rawScore = calculateRawScore(answers, allQuestions)
  const bandScore = calculateBandScore(rawScore, testData.totalQuestions)

  const partResults: PartResult[] = testData.parts.map((part) => {
    let correctAnswers = 0
    part.questions.forEach((question) => {
      const userAnswer = answers[question.id]?.value
      if (validateAnswer(userAnswer, question.correctAnswer, question.acceptableAnswers)) {
        correctAnswers++
      }
    })
    return {
      partNumber: part.partNumber,
      totalQuestions: part.questions.length,
      correctAnswers,
    }
  })

  const questionResults: QuestionResult[] = testData.parts.flatMap((part) =>
    part.questions.map((question) => {
      const userAnswer = answers[question.id]?.value || ''
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: validateAnswer(userAnswer, question.correctAnswer, question.acceptableAnswers),
        questionType: question.type,
      }
    })
  )

  return {
    testId: testData.id,
    totalQuestions: testData.totalQuestions,
    correctAnswers: rawScore,
    score: bandScore,
    rawScore,
    timeSpent,
    completedAt: new Date().toISOString(),
    partResults,
    questionResults,
  }
}
