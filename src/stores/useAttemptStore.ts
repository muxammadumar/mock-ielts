import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPublishedTests, getTestStructure, startAttempt, advanceSection, submitAttempt, getAttemptResult } from '@/services/testService'

export const useAttemptStore = defineStore('attempt', () => {
  const attemptId = ref<string | null>(null)
  const testId = ref<string | null>(null)
  const testStructure = ref<any | null>(null)
  const currentSection = ref<'listening' | 'reading' | 'writing' | 'speaking' | null>(null)
  const result = ref<any | null>(null)

  const initTest = async () => {
    // 1. Fetch published tests — response shape: { data: [{ id, title, ... }] }
    const testsResponse: any = await getPublishedTests()
    const tests: any[] = testsResponse?.data ?? []
    if (!tests.length) throw new Error('No published tests available')

    const resolvedTestId: string = tests[0]?.id

    // 2. Fetch test structure — response shape: { data: { id, sections: [...] } }
    const structureResponse: any = await getTestStructure(resolvedTestId)
    const structure = structureResponse?.data

    // 3. Create attempt — response shape: { data: { id, currentSection, ... } }
    const attemptResponse: any = await startAttempt({
      testId: resolvedTestId,
      random: false,
      mode: 'FULL',
      requestedSections: ['LISTENING', 'READING', 'WRITING', 'SPEAKING'],
    })
    const attempt = attemptResponse?.data

    testId.value = resolvedTestId
    testStructure.value = structure
    attemptId.value = attempt?.id ?? null
    const apiSection = attempt?.currentSection as string | undefined
    currentSection.value = apiSection
      ? (apiSection.toLowerCase() as 'listening' | 'reading' | 'writing' | 'speaking')
      : 'listening'
  }

  const advance = async () => {
    if (!attemptId.value) return
    await advanceSection(attemptId.value)
  }

  const submit = async () => {
    if (!attemptId.value) return
    await submitAttempt(attemptId.value)
  }

  const getResult = async () => {
    if (!attemptId.value) return null
    return getAttemptResult(attemptId.value)
  }

  const reset = () => {
    attemptId.value = null
    testId.value = null
    testStructure.value = null
    currentSection.value = null
    result.value = null
  }

  return {
    attemptId,
    testId,
    testStructure,
    currentSection,
    result,
    initTest,
    advance,
    submit,
    getResult,
    reset,
  }
})
