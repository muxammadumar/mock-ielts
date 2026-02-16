<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useReadingStore } from '@/stores/useReadingStore'
import { useReadingTest } from '@/composables/useReadingTest'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { upsertAnswers, advanceSection, formatListeningAnswers } from '@/services/testService'
import Timer from '@/components/listening/Timer.vue'
import PassageQuestionsTab from '@/components/reading/PassageQuestionsTab.vue'
import ReadingPassage from '@/components/reading/ReadingPassage.vue'
import ReadingQuestionsList from '@/components/reading/ReadingQuestionsList.vue'

const router = useRouter()
const readingStore = useReadingStore()
const attemptStore = useAttemptStore()
const { testData, fetchTestData } = useReadingTest()

// Computed properties
const currentPartData = computed(() => {
  return testData.value.parts[readingStore.currentPartIndex] || testData.value.parts[0]
})

const partTitle = computed(() => {
  return `Reading · Part ${currentPartData.value.partNumber}`
})

const submitButtonText = computed(() => {
  return readingStore.isLastPart ? 'Submit' : 'Next Part'
})

// Event handlers
const handleAnswerChange = (questionId: number, value: string | string[]) => {
  readingStore.setAnswer(questionId, value)
}

const handleBack = async () => {
  if (readingStore.hasStarted && !readingStore.testResult) {
    try {
      await showConfirmDialog({
        title: 'Leave Test?',
        message: 'Your progress will be lost. Are you sure?',
        confirmButtonText: 'Leave',
        cancelButtonText: 'Stay',
      })
      router.back()
    } catch {
      // User cancelled
    }
  } else {
    router.back()
  }
}

const handleSubmit = async () => {
  if (readingStore.isLastPart) {
    // Final submit
    try {
      await showConfirmDialog({
        title: 'Submit Test',
        message: `You have answered ${readingStore.totalAnswered} out of ${testData.value.totalQuestions} questions. Do you want to submit?`,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      })

      readingStore.submitTest(testData.value)

      // If in full test flow, save answers and advance to next section
      if (attemptStore.attemptId) {
        try {
          await upsertAnswers(attemptStore.attemptId, {
            answers: formatListeningAnswers(readingStore.answers),
          })
          await advanceSection(attemptStore.attemptId)
        } catch (apiError) {
          console.error('Failed to save reading answers:', apiError)
        }
        router.push({ name: 'writing-intro' })
      } else {
        showToast({ message: 'Test submitted successfully!', type: 'success' })
        router.push({ name: 'mock-test' })
      }
    } catch {
      // User cancelled
      console.log('Submission cancelled')
    }
  } else {
    // Advance to next part
    readingStore.advanceToNextPart()
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Prevent page refresh during test
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (readingStore.hasStarted && !readingStore.testResult) {
    e.preventDefault()
    e.returnValue = 'Test progress will be lost. Are you sure you want to leave?'
    return e.returnValue
  }
}

// Lifecycle
onMounted(async () => {
  await fetchTestData()
  readingStore.startTimer(testData.value)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  readingStore.stopTimer()
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div class="reading-test-view">
    <div class="reading-test-view__header">
      <button class="reading-test-view__back-button" @click="handleBack">
        <Icon name="arrow-left" size="24px" color="#171717" />
      </button>
      <span class="reading-test-view__title">{{ partTitle }}</span>
      <Timer :time-remaining="readingStore.timeRemaining" />
    </div>

    <div class="reading-test-view__tabs">
      <PassageQuestionsTab
        :active-tab="readingStore.activeTab"
        @update:active-tab="readingStore.setActiveTab"
      />
    </div>

    <div class="reading-test-view__content">
      <!-- Passage View -->
      <ReadingPassage
        v-if="readingStore.activeTab === 'passage'"
        :passage="currentPartData.passage"
        :is-collapsed="readingStore.isPassageCollapsed"
        @toggle-collapse="readingStore.togglePassageCollapse"
      />

      <!-- Questions View -->
      <template v-else>
        <ReadingQuestionsList
          :questions="currentPartData.questions"
          :answers="readingStore.answers"
          :instruction="currentPartData.instruction"
          @answer-change="handleAnswerChange"
        />

        <van-button
          type="primary"
          block
          size="large"
          class="reading-test-view__submit-button"
          @click="handleSubmit"
        >
          {{ submitButtonText }}
        </van-button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reading-test-view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f1f2ff;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: var(--color-background-white);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;
  }

  &__back-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  &__title {
    flex: 1;
    font-size: 17px;
    font-weight: 700;
    color: var(--color-text-primary);
    text-align: center;
    padding: 0 8px;
    letter-spacing: -0.025em;
    line-height: 22px;
  }

  &__tabs {
    padding: 12px 16px;
    position: sticky;
    top: 68px;
    z-index: 9;
    background-color: #f1f2ff;
  }

  &__content {
    flex: 1;
    padding: 0 16px 16px;
    padding-bottom: calc(16px + 80px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__submit-button {
    height: 56px;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 900;
    margin-top: 24px;
  }
}
</style>
