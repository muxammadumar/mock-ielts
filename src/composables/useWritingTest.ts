import { ref } from 'vue'
import type { WritingTest } from '@/types/writing'
import { mockWritingTest } from '@/data/writingTestData'
import { useAttemptStore } from '@/stores/useAttemptStore'

export const useWritingTest = () => {
  const isLoading = ref(false)
  const testData = ref<WritingTest>(mockWritingTest)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      const attemptStore = useAttemptStore()
      const structure = attemptStore.testStructure

      if (structure) {
        const writingSection =
          structure.sections?.find((s: any) => s.sectionType === 'WRITING') ??
          null

        if (writingSection) {
          testData.value = writingSection as WritingTest
          return
        }
      }

      testData.value = mockWritingTest
    } catch (error) {
      console.error('Error fetching writing test:', error)
      testData.value = mockWritingTest
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
