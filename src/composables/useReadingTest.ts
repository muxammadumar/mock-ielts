import { ref } from 'vue'
import type { ReadingTest } from '@/types/reading'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { transformReadingSection } from '@/utils/sectionTransformers'

export const useReadingTest = () => {
  const isLoading = ref(false)
  const testData = ref<ReadingTest | null>(null)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      const attemptStore = useAttemptStore()
      const structure = attemptStore.testStructure

      if (structure) {
        const readingSection =
          structure.sections?.find((s: any) => s.sectionType === 'READING') ?? null

        if (readingSection) {
          testData.value = transformReadingSection(readingSection)
        }
      }
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
