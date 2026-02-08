import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { Answer, ListeningTest, ListeningTestResult } from '@/types/listening'
import { generateTestResult } from '@/utils/scoringUtils'

export const useListeningStore = defineStore('listening', () => {
  const router = useRouter()

  // State
  const currentPartIndex = ref(0)
  const answers = ref<Record<number, Answer>>({})
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const audioDuration = ref(0)
  const timeRemaining = ref(40 * 60) // 40 minutes in seconds
  const hasStarted = ref(false)
  const timerInterval = ref<number | null>(null)
  const testResult = ref<ListeningTestResult | null>(null)

  // Getters
  const currentPart = computed(() => currentPartIndex.value)
  const totalAnswered = computed(() => Object.keys(answers.value).length)
  const progress = computed(() => {
    // Calculate progress based on answered questions (assuming 40 total)
    return Math.round((totalAnswered.value / 40) * 100)
  })

  // Actions
  const setCurrentPart = (index: number) => {
    currentPartIndex.value = index
  }

  const setAnswer = (questionId: number, value: string | string[]) => {
    answers.value[questionId] = { questionId, value }
  }

  const getAnswer = (questionId: number): Answer | undefined => {
    return answers.value[questionId]
  }

  const setPlayingState = (playing: boolean) => {
    isPlaying.value = playing
  }

  const updateCurrentTime = (time: number) => {
    currentTime.value = time
  }

  const setAudioDuration = (duration: number) => {
    audioDuration.value = duration
  }

  const startTimer = (testData: ListeningTest) => {
    if (timerInterval.value) return

    hasStarted.value = true
    timerInterval.value = window.setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        stopTimer()
        autoSubmitTest(testData)
      }
    }, 1000)
  }

  const autoSubmitTest = (testData: ListeningTest) => {
    if (testResult.value) return // Already submitted

    showToast({
      message: 'Time is up! Submitting your test...',
      duration: 2000,
    })

    submitTest(testData)

    // Navigate to results page after short delay
    setTimeout(() => {
      router.push({ name: 'listening-results' })
    }, 2000)
  }

  const stopTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  const resetTest = () => {
    currentPartIndex.value = 0
    answers.value = {}
    isPlaying.value = false
    currentTime.value = 0
    audioDuration.value = 0
    timeRemaining.value = 40 * 60
    hasStarted.value = false
    testResult.value = null
    stopTimer()
  }

  const submitTest = (testData: ListeningTest): ListeningTestResult => {
    stopTimer()

    // Calculate time spent
    const timeSpent = (40 * 60) - timeRemaining.value

    // Generate result using scoring utility
    const result = generateTestResult(testData, answers.value, timeSpent)

    testResult.value = result

    return result
  }

  return {
    // State
    currentPartIndex,
    answers,
    isPlaying,
    currentTime,
    audioDuration,
    timeRemaining,
    hasStarted,
    testResult,

    // Getters
    currentPart,
    totalAnswered,
    progress,

    // Actions
    setCurrentPart,
    setAnswer,
    getAnswer,
    setPlayingState,
    updateCurrentTime,
    setAudioDuration,
    startTimer,
    stopTimer,
    resetTest,
    submitTest,
    autoSubmitTest,
  }
})
