<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useListeningStore } from '@/stores/useListeningStore'
import { useListeningTest } from '@/composables/useListeningTest'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { upsertAnswers, advanceSection, formatListeningAnswers } from '@/services/testService'
import AudioPlayer from '@/components/listening/AudioPlayer.vue'
import Timer from '@/components/listening/Timer.vue'
import PartIndicator from '@/components/listening/PartIndicator.vue'
import PartNavigation from '@/components/listening/PartNavigation.vue'
import QuestionsList from '@/components/listening/QuestionsList.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()
const listeningStore = useListeningStore()
const attemptStore = useAttemptStore()
const { testData, fetchTestData } = useListeningTest()

// Computed properties
const currentPartData = computed(() => {
  if (!testData.value) return null
  return testData.value.parts[listeningStore.currentPartIndex] || testData.value.parts[0]
})

const partTitle = computed(() => {
  if (!currentPartData.value) return 'Listening'
  return `Listening · Part ${currentPartData.value.partNumber}`
})

// Event handlers
const handlePlay = () => {
  listeningStore.setPlayingState(true)
}

const handlePause = () => {
  listeningStore.setPlayingState(false)
}

const handleTimeUpdate = (time: number) => {
  listeningStore.updateCurrentTime(time)
}

const handleChangePart = (partIndex: number) => {
  listeningStore.setCurrentPart(partIndex)
}

const handleAnswerChange = (questionId: number, value: string | string[]) => {
  listeningStore.setAnswer(questionId, value)
}

const handleBack = async () => {
  if (listeningStore.hasStarted && !listeningStore.testResult) {
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
  try {
    await showConfirmDialog({
      title: 'Submit Test',
      message: `You have answered ${listeningStore.totalAnswered} out of ${testData.value?.totalQuestions ?? 0} questions. Do you want to submit?`,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    })

    listeningStore.submitTest(testData.value!)

    // If in full test flow, save answers and advance to next section
    if (attemptStore.attemptId) {
      try {
        const allQuestions = testData.value?.parts.flatMap((p) => p.questions) ?? []
        await upsertAnswers(attemptStore.attemptId, {
          answers: formatListeningAnswers(listeningStore.answers, allQuestions),
        })
        await advanceSection(attemptStore.attemptId)
      } catch (apiError) {
        console.error('Failed to save listening answers:', apiError)
      }
      router.push({ name: 'reading-intro' })
    } else {
      showToast({ message: 'Test submitted successfully!', type: 'success' })
      router.push({ name: 'listening-results' })
    }
  } catch (error) {
    // User cancelled
    console.log('Submission cancelled')
  }
}

// Prevent page refresh during test
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (listeningStore.hasStarted && !listeningStore.testResult) {
    e.preventDefault()
    e.returnValue = 'Test progress will be lost. Are you sure you want to leave?'
    return e.returnValue
  }
}

// Lifecycle
onMounted(async () => {
  await fetchTestData()
  if (testData.value) {
    listeningStore.startTimer(testData.value)
  }
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // Cleanup: stop timer when leaving the page
  listeningStore.stopTimer()
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div class="listening-test-view">
    <div class="listening-test-view__header">
      <button class="listening-test-view__back-button" @click="handleBack">
        <Icon name="arrow-left" size="24px" color="#171717" />
      </button>
      <span class="listening-test-view__title">{{ partTitle }}</span>
      <Timer :time-remaining="listeningStore.timeRemaining" />
    </div>

    <div v-if="testData && currentPartData" class="listening-test-view__content">
      <AudioPlayer
        :audio-url="currentPartData?.audioUrl ?? testData.audioUrl"
        :control-mode="testData.audioControlMode"
        @play="handlePlay"
        @pause="handlePause"
        @time-update="handleTimeUpdate"
      />

      <PartIndicator
        :part-number="currentPartData.partNumber"
        :subtitle="currentPartData.subtitle"
      />

      <PartNavigation
        :current-part="listeningStore.currentPartIndex"
        :total-parts="testData.parts.length"
        @change-part="handleChangePart"
      />

      <QuestionsList
        :questions="currentPartData.questions"
        :answers="listeningStore.answers"
        @answer-change="handleAnswerChange"
      />

    </div>
    <PrimaryButton @click="handleSubmit">Submit</PrimaryButton>
  </div>
</template>

<style scoped lang="scss">
.listening-test-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

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
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-primary);
    text-align: center;
    padding: 0 8px;
  }

  &__content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

</style>
