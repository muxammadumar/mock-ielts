import { ref } from 'vue'
import type { ListeningTest } from '@/types/listening'
import { mockListeningTest } from '@/data/listeningTestData'

export const useListeningTest = () => {
  const isLoading = ref(false)
  const testData = ref<ListeningTest>(mockListeningTest)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      // In real implementation: const response = await testService.getListeningTest()
      // testData.value = response
      testData.value = mockListeningTest
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
