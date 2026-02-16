<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useSpeakingStore } from '@/stores/useSpeakingStore'
import { useSpeakingTest } from '@/composables/useSpeakingTest'
import { useAttemptStore } from '@/stores/useAttemptStore'
import { upsertAnswers, submitAttempt, uploadAudioFile, formatSpeakingAnswers } from '@/services/testService'
import Timer from '@/components/listening/Timer.vue'
import SpeakingQuestionCard from '@/components/speaking/SpeakingQuestionCard.vue'
import VoiceRecorder from '@/components/speaking/VoiceRecorder.vue'

const router = useRouter()
const speakingStore = useSpeakingStore()
const attemptStore = useAttemptStore()
const { testData, fetchTestData } = useSpeakingTest()

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
    try {
      await showConfirmDialog({
        title: 'Submit Test',
        message: `You have answered ${speakingStore.questionsAnswered} out of ${testData.value.totalQuestions} questions. Do you want to submit?`,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      })

      speakingStore.submitTest()

      // If in full test flow, upload recordings, save answers, and submit attempt
      if (attemptStore.attemptId) {
        try {
          const questions = allQuestions.value
          const recordingEntries = questions.map((q) => ({
            questionId: q.id,
            blob: speakingStore.getRecording(q.id) ?? null,
          }))

          // Upload each recording that has a blob
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
        } catch (apiError) {
          console.error('Failed to save speaking answers:', apiError)
        }
        router.push({ name: 'listening-results' })
      } else {
        showToast({ message: 'Test submitted successfully!', type: 'success' })
        router.push({ name: 'mock-test' })
      }
    } catch {
      // User cancelled
    }
  } else {
    speakingStore.advanceToNextQuestion()
    speakingStore.startQuestionTimer()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
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

      <van-button
        type="primary"
        block
        size="large"
        class="speaking-test-view__submit-button"
        @click="handleSubmit"
      >
        {{ submitButtonText }}
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.speaking-test-view {
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
    margin-top: 8px;
  }
}
</style>
