<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useSpeakingStore } from '@/stores/useSpeakingStore'
import { useSpeakingTest } from '@/composables/useSpeakingTest'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { upsertAnswers, submitAttempt, uploadAudioFile, formatSpeakingAnswers, getAttemptResult } from '@/services/testService'
import Timer from '@/components/listening/Timer.vue'
import SpeakingQuestionCard from '@/components/speaking/SpeakingQuestionCard.vue'
import VoiceRecorder from '@/components/speaking/VoiceRecorder.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

const router = useRouter()
const speakingStore = useSpeakingStore()
const attemptStore = useAttemptStore()
const { testData, fetchTestData } = useSpeakingTest()

const showFinishDialog = ref(false)
const isAnalyzing = ref(false)

const allQuestions = computed(() => testData.value.parts.flatMap((p) => p.questions))
const currentQuestion = computed(() => allQuestions.value[speakingStore.currentQuestionIndex])
const currentPart = computed(() =>
  testData.value.parts.find((p) =>
    p.questions.some((q) => q.id === currentQuestion.value?.id),
  ),
)

const headerTitle = computed(
  () => `Speaking · Part ${currentPart.value?.partNumber ?? 1}`,
)

const submitButtonText = computed(() => (speakingStore.isLastQuestion ? 'Submit' : 'Next Question'))

const handleRecorded = (blob: Blob) => {
  speakingStore.setRecording(currentQuestion.value.id, blob)
}

const handleRecordingStart = () => {
  speakingStore.setRecordingState('recording')
}

const handleRecordingPause = () => {
  speakingStore.setRecordingState('paused')
}

const handleRecordingStop = () => {
  speakingStore.setRecordingState('idle')
}

const handleRecordingDelete = () => {
  speakingStore.setRecording(currentQuestion.value.id, null)
  speakingStore.setRecordingState('idle')
}

const handleBack = async () => {
  if (speakingStore.hasStarted && !speakingStore.testResult) {
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
  if (speakingStore.isLastQuestion) {
    if (attemptStore.attemptId) {
      // Full test mode: show custom confirmation dialog
      showFinishDialog.value = true
    } else {
      // Non-full-test mode: use existing Vant confirm dialog
      try {
        await showConfirmDialog({
          title: 'Submit Test',
          message: `You have answered ${speakingStore.questionsAnswered} out of ${testData.value.totalQuestions} questions. Do you want to submit?`,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
        })
        speakingStore.submitTest()
        showToast({ message: 'Test submitted successfully!', type: 'success' })
        router.push({ name: 'mock-test' })
      } catch {
        // User cancelled
      }
    }
  } else {
    speakingStore.advanceToNextQuestion()
    speakingStore.startQuestionTimer()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleFinishSubmit = async () => {
  showFinishDialog.value = false
  isAnalyzing.value = true

  try {
    speakingStore.submitTest()

    const questions = allQuestions.value
    const recordingEntries = questions.map((q) => ({
      questionId: q.id,
      blob: speakingStore.getRecording(q.id) ?? null,
    }))

    const fileIds = await Promise.all(
      recordingEntries.map(async (rec) => {
        if (rec.blob) {
          try {
            return await uploadAudioFile(rec.blob)
          } catch {
            return ''
          }
        }
        return ''
      }),
    )

    await upsertAnswers(attemptStore.attemptId!, {
      answers: formatSpeakingAnswers(recordingEntries, fileIds),
    })
    await submitAttempt(attemptStore.attemptId!)
    const apiResult = await getAttemptResult(attemptStore.attemptId!)
    attemptStore.result = apiResult?.data ?? apiResult
  } catch (apiError) {
    console.error('Failed to save speaking answers:', apiError)
  }

  isAnalyzing.value = false
  router.push({ name: 'mock-test-result' })
}

const handleFinishCancel = () => {
  showFinishDialog.value = false
}

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (speakingStore.hasStarted && !speakingStore.testResult) {
    e.preventDefault()
    e.returnValue = 'Test progress will be lost. Are you sure you want to leave?'
    return e.returnValue
  }
}

onMounted(async () => {
  await fetchTestData()
  speakingStore.totalQuestions = testData.value.totalQuestions
  speakingStore.startQuestionTimer()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  speakingStore.stopTimer()
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div class="speaking-test-view">
    <div class="speaking-test-view__header">
      <button class="speaking-test-view__back-button" @click="handleBack">
        <Icon name="arrow-left" size="24px" color="#171717" />
      </button>
      <span class="speaking-test-view__title">{{ headerTitle }}</span>
      <Timer :time-remaining="speakingStore.questionTimeRemaining" />
    </div>

    <div v-if="currentQuestion" class="speaking-test-view__content">
      <SpeakingQuestionCard
        :question="currentQuestion"
        :part-number="currentPart?.partNumber ?? 1"
        :total-questions="testData.totalQuestions"
      />

      <VoiceRecorder
        :recording-state="speakingStore.recordingState"
        @start="handleRecordingStart"
        @pause="handleRecordingPause"
        @stop="handleRecordingStop"
        @delete="handleRecordingDelete"
        @recorded="handleRecorded"
      />
    </div>
    <PrimaryButton @click="handleSubmit">{{ submitButtonText }}</PrimaryButton>

    <!-- Confirmation overlay -->
    <div v-if="showFinishDialog" class="speaking-test-view__overlay">
      <div class="speaking-test-view__dialog">
        <div class="speaking-test-view__dialog-icon">⚠️</div>
        <h3 class="speaking-test-view__dialog-title">Finish Full Mock Test?</h3>
        <p class="speaking-test-view__dialog-text">
          You are about to submit all sections. This action cannot be undone.
        </p>
        <div class="speaking-test-view__dialog-buttons">
          <button class="speaking-test-view__dialog-btn speaking-test-view__dialog-btn--back" @click="handleFinishCancel">
            Go Back to Test
          </button>
          <button class="speaking-test-view__dialog-btn speaking-test-view__dialog-btn--submit" @click="handleFinishSubmit">
            Finish & Submit
          </button>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isAnalyzing" class="speaking-test-view__overlay">
      <div class="speaking-test-view__dialog">
        <div class="speaking-test-view__spinner" />
        <h3 class="speaking-test-view__dialog-title">Analyzing Your Answers...</h3>
        <p class="speaking-test-view__dialog-text">
          Please wait while our AI reviews your responses. This may take a moment.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.speaking-test-view {
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

  &__overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 24px;
  }

  &__dialog {
    background: #ffffff;
    border-radius: 24px;
    padding: 28px 24px;
    width: 100%;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    &-icon {
      font-size: 40px;
      line-height: 1;
    }

    &-title {
      font-size: 18px;
      font-weight: 700;
      color: #171717;
      text-align: center;
      margin: 0;
    }

    &-text {
      font-size: 14px;
      color: #5c5c5c;
      text-align: center;
      margin: 0;
      line-height: 1.5;
    }

    &-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      margin-top: 8px;
    }

    &-btn {
      width: 100%;
      height: 48px;
      border-radius: 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;

      &:active {
        opacity: 0.8;
      }

      &--back {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        color: #171717;
      }

      &--submit {
        background: var(--color-primary);
        border: none;
        color: #ffffff;
      }
    }
  }

  &__spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e5e5;
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
