import { ref } from 'vue'
import type { ReadingTest } from '@/types/reading'
import { mockReadingTest } from '@/data/readingTestData'

export const useReadingTest = () => {
  const isLoading = ref(false)
  const testData = ref<ReadingTest>(mockReadingTest)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      testData.value = mockReadingTest
    } catch (error) {
      console.error('Error fetching reading test:', error)
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
