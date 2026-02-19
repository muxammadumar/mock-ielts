import { ref } from 'vue'
import type { SpeakingTest } from '@/types/speaking'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { transformSpeakingSection } from '@/utils/sectionTransformers'

export const useSpeakingTest = () => {
  const isLoading = ref(false)
  const testData = ref<SpeakingTest | null>(null)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      const attemptStore = useAttemptStore()
      const structure = attemptStore.testStructure

      if (structure) {
        const speakingSection =
          structure.sections?.find((s: any) => s.sectionType === 'SPEAKING') ?? null

        if (speakingSection) {
          testData.value = transformSpeakingSection(speakingSection)
        }
      }
    } catch (error) {
      console.error('Error fetching speaking test:', error)
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
