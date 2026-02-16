import { ref } from 'vue'
import type { ReadingTest } from '@/types/reading'
import { mockReadingTest } from '@/data/readingTestData'
import { useAttemptStore } from '@/stores/useAttemptStore'

export const useReadingTest = () => {
  const isLoading = ref(false)
  const testData = ref<ReadingTest>(mockReadingTest)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      const attemptStore = useAttemptStore()
      const structure = attemptStore.testStructure

      if (structure) {
        const readingSection =
          structure.sections?.find((s: any) => s.sectionType === 'READING') ??
          null

        if (readingSection) {
          testData.value = readingSection as ReadingTest
          return
        }
      }

      testData.value = mockReadingTest
    } catch (error) {
      console.error('Error fetching reading test:', error)
      testData.value = mockReadingTest
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
