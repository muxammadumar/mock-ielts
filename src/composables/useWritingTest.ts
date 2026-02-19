import { ref } from 'vue'
import type { WritingTest } from '@/types/writing'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { transformWritingSection } from '@/utils/sectionTransformers'

export const useWritingTest = () => {
  const isLoading = ref(false)
  const testData = ref<WritingTest | null>(null)

  const fetchTestData = async () => {
    isLoading.value = true
    try {
      const attemptStore = useAttemptStore()
      const structure = attemptStore.testStructure

      if (structure) {
        const writingSection =
          structure.sections?.find((s: any) => s.sectionType === 'WRITING') ?? null

        if (writingSection) {
          testData.value = transformWritingSection(writingSection)
        }
      }
    } catch (error) {
      console.error('Error fetching writing test:', error)
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
