<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useWritingStore } from '@/stores/useWritingStore'
import { useWritingTest } from '@/composables/useWritingTest'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { upsertAnswers, advanceSection, formatWritingAnswers } from '@/services/testService'
import Timer from '@/components/listening/Timer.vue'
import WritingTaskCard from '@/components/writing/WritingTaskCard.vue'
import WritingAnswerInput from '@/components/writing/WritingAnswerInput.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()
const writingStore = useWritingStore()
const attemptStore = useAttemptStore()
const { testData, fetchTestData } = useWritingTest()

const currentTask = computed(() => testData.value?.tasks[writingStore.currentTaskIndex] ?? null)

const taskTitle = computed(() => `Writing · Part ${writingStore.currentTaskIndex + 1}/2`)

const submitButtonText = computed(() => (writingStore.isLastTask ? 'Submit' : 'Next Task'))

const currentAnswer = computed(() => writingStore.getAnswer(currentTask.value?.taskKey)?.value ?? '')

const handleAnswerChange = (value: string) => {
  writingStore.setAnswer(currentTask.value.taskKey, value)
}

const handleBack = async () => {
  if (writingStore.hasStarted && !writingStore.testResult) {
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
  if (writingStore.isLastTask) {
    try {
      await showConfirmDialog({
        title: 'Submit Test',
        message: `You have answered ${writingStore.totalAnswered} out of 2 tasks. Do you want to submit?`,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      })

      writingStore.submitTest()

      // If in full test flow, save answers and advance to next section
      if (attemptStore.attemptId) {
        try {
          await upsertAnswers(attemptStore.attemptId, {
            writings: formatWritingAnswers(writingStore.answers),
          })
          await advanceSection(attemptStore.attemptId)
        } catch (apiError) {
          console.error('Failed to save writing answers:', apiError)
        }
        router.push({ name: 'speaking-intro' })
      } else {
        showToast({ message: 'Test submitted successfully!', type: 'success' })
        router.push({ name: 'mock-test' })
      }
    } catch {
      // User cancelled
    }
  } else {
    writingStore.advanceToNextTask()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (writingStore.hasStarted && !writingStore.testResult) {
    e.preventDefault()
    e.returnValue = 'Test progress will be lost. Are you sure you want to leave?'
    return e.returnValue
  }
}

onMounted(async () => {
  await fetchTestData()
  if (testData.value) {
    writingStore.startTimer()
  }
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  writingStore.stopTimer()
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div class="writing-test-view">
    <div class="writing-test-view__header">
      <button class="writing-test-view__back-button" @click="handleBack">
        <Icon name="arrow-left" size="24px" color="#171717" />
      </button>
      <span class="writing-test-view__title">{{ taskTitle }}</span>
      <Timer :time-remaining="writingStore.timeRemaining" />
    </div>

    <div v-if="currentTask" class="writing-test-view__content">
      <WritingTaskCard :task="currentTask" />

      <WritingAnswerInput
        :model-value="currentAnswer"
        :min-words="currentTask.minWords"
        @update:model-value="handleAnswerChange"
      />
    </div>
    <PrimaryButton @click="handleSubmit">{{ submitButtonText }}</PrimaryButton>
  </div>
</template>

<style scoped lang="scss">
.writing-test-view {
  width: 100%;
  height: 100%;
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

  &__content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
