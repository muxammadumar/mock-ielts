import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { Answer, ReadingTest, ReadingTestResult, ReadingTab } from '@/types/reading'
import { generateReadingTestResult } from '@/utils/scoringUtils'

export const useReadingStore = defineStore('reading', () => {
  const router = useRouter()

  // State
  const currentPartIndex = ref(0)
  const answers = ref<Record<number, Answer>>({})
  const timeRemaining = ref(60 * 60) // 60 minutes in seconds
  const hasStarted = ref(false)
  const timerInterval = ref<number | null>(null)
  const testResult = ref<ReadingTestResult | null>(null)
  const activeTab = ref<ReadingTab>('passage')
  const isPassageCollapsed = ref(false)

  // Getters
  const currentPart = computed(() => currentPartIndex.value)
  const totalAnswered = computed(() => Object.keys(answers.value).length)
  const progress = computed(() => Math.round((totalAnswered.value / 40) * 100))
  const isLastPart = computed(() => currentPartIndex.value === 2)

  // Actions
  const setActiveTab = (tab: ReadingTab) => {
    activeTab.value = tab
  }

  const togglePassageCollapse = () => {
    isPassageCollapsed.value = !isPassageCollapsed.value
  }

  const setAnswer = (questionId: number, value: string | string[]) => {
    answers.value[questionId] = { questionId, value }
  }

  const getAnswer = (questionId: number): Answer | undefined => {
    return answers.value[questionId]
  }

  const advanceToNextPart = () => {
    if (currentPartIndex.value < 2) {
      currentPartIndex.value++
      activeTab.value = 'passage'
      isPassageCollapsed.value = false
    }
  }

  const startTimer = (testData: ReadingTest) => {
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

  const autoSubmitTest = (testData: ReadingTest) => {
    if (testResult.value) return

    showToast({
      message: 'Time is up! Submitting your test...',
      duration: 2000,
    })

    submitTest(testData)

    setTimeout(() => {
      router.push({ name: 'mock-test' })
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
    timeRemaining.value = 60 * 60
    hasStarted.value = false
    testResult.value = null
    activeTab.value = 'passage'
    isPassageCollapsed.value = false
    stopTimer()
  }

  const submitTest = (testData: ReadingTest): ReadingTestResult => {
    stopTimer()

    const timeSpent = (60 * 60) - timeRemaining.value
    const result = generateReadingTestResult(testData, answers.value, timeSpent)
    testResult.value = result

    return result
  }

  return {
    // State
    currentPartIndex,
    answers,
    timeRemaining,
    hasStarted,
    testResult,
    activeTab,
    isPassageCollapsed,

    // Getters
    currentPart,
    totalAnswered,
    progress,
    isLastPart,

    // Actions
    setActiveTab,
    togglePassageCollapse,
    setAnswer,
    getAnswer,
    advanceToNextPart,
    startTimer,
    stopTimer,
    resetTest,
    submitTest,
    autoSubmitTest,
  }
})
