<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useListeningStore } from '@/stores/useListeningStore'
import { useListeningTest } from '@/composables/useListeningTest'
import AudioPlayer from '@/components/listening/AudioPlayer.vue'
import Timer from '@/components/listening/Timer.vue'
import PartIndicator from '@/components/listening/PartIndicator.vue'
import PartNavigation from '@/components/listening/PartNavigation.vue'
import QuestionsList from '@/components/listening/QuestionsList.vue'

const router = useRouter()
const listeningStore = useListeningStore()
const { testData, fetchTestData } = useListeningTest()

// Computed properties
const currentPartData = computed(() => {
  return testData.value.parts[listeningStore.currentPartIndex] || testData.value.parts[0]
})

const partTitle = computed(() => {
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
      message: `You have answered ${listeningStore.totalAnswered} out of ${testData.value.totalQuestions} questions. Do you want to submit?`,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    })

    // Submit the test with testData
    listeningStore.submitTest(testData.value)

    showToast({
      message: 'Test submitted successfully!',
      type: 'success',
    })

    // Navigate to results page
    router.push({ name: 'listening-results' })
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
  listeningStore.startTimer(testData.value)
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

    <div class="listening-test-view__content">
      <AudioPlayer
        :audio-url="testData.audioUrl"
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

      <van-button
        type="primary"
        block
        size="large"
        class="listening-test-view__submit-button"
        @click="handleSubmit"
      >
        Submit
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.listening-test-view {
  width: 100%;
  min-height: 100vh;
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
