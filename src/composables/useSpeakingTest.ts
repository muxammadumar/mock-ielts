import { ref } from 'vue'
import type { SpeakingTest } from '@/types/speaking'
import { mockSpeakingTest } from '@/data/speakingTestData'
import { useAttemptStore } from '@/stores/useAttemptStore'

export const useSpeakingTest = () => {
  const isLoading = ref(false)
  const testData = ref<SpeakingTest>(mockSpeakingTest)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      const attemptStore = useAttemptStore()
      const structure = attemptStore.testStructure

      if (structure) {
        const speakingSection =
          structure.sections?.find((s: any) => s.sectionType === 'SPEAKING') ??
          null

        if (speakingSection) {
          testData.value = speakingSection as SpeakingTest
          return
        }
      }

      testData.value = mockSpeakingTest
    } catch (error) {
      console.error('Error fetching speaking test:', error)
      testData.value = mockSpeakingTest
    } finally {
      isLoading.value = false
    }
  }

  return {
    testData,
    isLoading,
    fetchTestData,
  }
}
