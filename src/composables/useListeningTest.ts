import { ref } from 'vue'
import type { ListeningTest } from '@/types/listening'
import { mockListeningTest } from '@/data/listeningTestData'
import { useAttemptStore } from '@/stores/useAttemptStore'

export const useListeningTest = () => {
  const isLoading = ref(false)
  const testData = ref<ListeningTest>(mockListeningTest)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      const attemptStore = useAttemptStore()
      const structure = attemptStore.testStructure

      if (structure) {
        // Try to extract listening section from the API structure
        const listeningSection =
          structure.sections?.find((s: any) => s.sectionType === 'LISTENING') ??
          null

        if (listeningSection) {
          testData.value = listeningSection as ListeningTest
          return
        }
      }

      // Fall back to mock data
      testData.value = mockListeningTest
    } catch (error) {
      console.error('Error fetching listening test:', error)
      testData.value = mockListeningTest
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
