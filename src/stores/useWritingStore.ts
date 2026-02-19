import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { WritingAnswer, WritingTestResult } from '@/types/writing'

export const useWritingStore = defineStore('writing', () => {
  const router = useRouter()

  // State
  const currentTaskIndex = ref<0 | 1>(0)
  const answers = ref<Record<string, WritingAnswer>>({})
  const timeRemaining = ref(60 * 60)
  const hasStarted = ref(false)
  const timerInterval = ref<number | null>(null)
  const testResult = ref<WritingTestResult | null>(null)

  // Getters
  const isLastTask = computed(() => currentTaskIndex.value === 1)
  const totalAnswered = computed(() => Object.keys(answers.value).length)

  // Actions
  const setAnswer = (taskKey: string, value: string) => {
    answers.value[taskKey] = { taskKey, value }
  }

  const getAnswer = (taskKey: string): WritingAnswer | undefined => {
    return answers.value[taskKey]
  }

  const advanceToNextTask = () => {
    if (currentTaskIndex.value === 0) {
      currentTaskIndex.value = 1
    }
  }

  const startTimer = () => {
    if (timerInterval.value) return

    hasStarted.value = true
    timerInterval.value = window.setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        stopTimer()
        autoSubmitTest()
      }
    }, 1000)
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

  const stopTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  const resetTest = () => {
    currentTaskIndex.value = 0
    answers.value = {}
    timeRemaining.value = 60 * 60
    hasStarted.value = false
    testResult.value = null
    stopTimer()
  }

  const submitTest = (): WritingTestResult => {
    stopTimer()

    const timeSpent = 60 * 60 - timeRemaining.value
    const result: WritingTestResult = {
      testId: 'writing-test-1',
      tasksAnswered: totalAnswered.value,
      timeSpent,
      completedAt: new Date().toISOString(),
    }
    testResult.value = result

    return result
  }

  return {
    currentTaskIndex,
    answers,
    timeRemaining,
    hasStarted,
    testResult,
    isLastTask,
    totalAnswered,
    setAnswer,
    getAnswer,
    advanceToNextTask,
    startTimer,
    stopTimer,
    resetTest,
    submitTest,
    autoSubmitTest,
  }
})
