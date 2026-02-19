import { ref } from 'vue'
import type { ListeningTest } from '@/types/listening'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { transformListeningSection } from '@/utils/sectionTransformers'

export const useListeningTest = () => {
  const isLoading = ref(false)
  const testData = ref<ListeningTest | null>(null)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      const attemptStore = useAttemptStore()
      const structure = attemptStore.testStructure

      if (structure) {
        const listeningSection =
          structure.sections?.find((s: any) => s.sectionType === 'LISTENING') ?? null

        if (listeningSection) {
          testData.value = transformListeningSection(listeningSection)
        }
      }
    } catch (error) {
      console.error('Error fetching listening test:', error)
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
