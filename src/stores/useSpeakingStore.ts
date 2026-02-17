import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { SpeakingTestResult, RecordingState } from '@/types/speaking'

export const useSpeakingStore = defineStore('speaking', () => {
  const router = useRouter()

  // State
  const currentQuestionIndex = ref(0)
  const recordings = ref<Record<number, Blob | null>>({})
  const questionTimeRemaining = ref(2 * 60)
  const hasStarted = ref(false)
  const timerInterval = ref<number | null>(null)
  const recordingState = ref<RecordingState>('idle')
  const testResult = ref<SpeakingTestResult | null>(null)
  const totalQuestions = ref(0)

  // Getters
  const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)
  const questionsAnswered = computed(() => Object.keys(recordings.value).length)

  // Actions
  const setRecording = (questionId: number, blob: Blob | null) => {
    recordings.value[questionId] = blob
  }

  const getRecording = (questionId: number): Blob | null | undefined => {
    return recordings.value[questionId]
  }

  const advanceToNextQuestion = () => {
    if (!isLastQuestion.value) {
      currentQuestionIndex.value++
      resetQuestionTimer()
    }
  }

  const startQuestionTimer = () => {
    stopTimer()
    hasStarted.value = true
    timerInterval.value = window.setInterval(() => {
      if (questionTimeRemaining.value > 0) {
        questionTimeRemaining.value--
      } else {
        stopTimer()
        // Auto-advance or auto-submit when time runs out
        if (isLastQuestion.value) {
          autoSubmitTest()
        } else {
          showToast({ message: 'Time is up for this question!', duration: 1500 })
          advanceToNextQuestion()
          startQuestionTimer()
        }
      }
    }, 1000)
  }

  const resetQuestionTimer = () => {
    questionTimeRemaining.value = 2 * 60
  }

  const stopTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  const setRecordingState = (state: RecordingState) => {
    recordingState.value = state
  }

  const autoSubmitTest = () => {
    if (testResult.value) return

    showToast({
      message: 'Time is up! Submitting your test...',
      duration: 2000,
    })

    submitTest()

    setTimeout(() => {
      router.push({ name: 'mock-test' })
    }, 2000)
  }

  const resetTest = () => {
    currentQuestionIndex.value = 0
    recordings.value = {}
    questionTimeRemaining.value = 2 * 60
    hasStarted.value = false
    testResult.value = null
    recordingState.value = 'idle'
    stopTimer()
  }

  const submitTest = (): SpeakingTestResult => {
    stopTimer()

    const result: SpeakingTestResult = {
      testId: 'speaking-test-1',
      questionsAnswered: questionsAnswered.value,
      timeSpent: totalQuestions.value * 2 * 60 - questionTimeRemaining.value,
      completedAt: new Date().toISOString(),
    }
    testResult.value = result

    return result
  }

  return {
    currentQuestionIndex,
    recordings,
    questionTimeRemaining,
    hasStarted,
    recordingState,
    testResult,
    totalQuestions,
    isLastQuestion,
    questionsAnswered,
    setRecording,
    getRecording,
    advanceToNextQuestion,
    startQuestionTimer,
    resetQuestionTimer,
    stopTimer,
    setRecordingState,
    resetTest,
    submitTest,
    autoSubmitTest,
  }
})
