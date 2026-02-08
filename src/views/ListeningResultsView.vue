<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useListeningStore } from '@/stores/useListeningStore'
import { formatTime } from '@/utils/formatTime'
import { showToast } from 'vant'
import type { QuestionResult } from '@/types/listening'

const router = useRouter()
const listeningStore = useListeningStore()

const activeReviewPart = ref<number | string>('')

// Computed properties
const testResult = computed(() => listeningStore.testResult)
const bandScore = computed(() => testResult.value?.score.toFixed(1) || '0.0')
const correctAnswers = computed(() => testResult.value?.correctAnswers || 0)
const totalQuestions = computed(() => testResult.value?.totalQuestions || 40)
const accuracy = computed(() => Math.round((correctAnswers.value / totalQuestions.value) * 100))
const accuracyRate = computed(() => accuracy.value)
const accuracyText = computed(() => `${accuracy.value}%`)
const partResults = computed(() => testResult.value?.partResults || [])
const questionResults = computed(() => testResult.value?.questionResults || [])

const formattedTime = computed(() => {
  if (!testResult.value) return '00:00'
  return formatTime(testResult.value.timeSpent)
})

const scoreColor = computed(() => {
  if (accuracy.value >= 80) return '#07c160'
  if (accuracy.value >= 60) return '#ff976a'
  return '#ee0a24'
})

// Methods
const getPartPercentage = (part: { correctAnswers: number; totalQuestions: number }): number => {
  return Math.round((part.correctAnswers / part.totalQuestions) * 100)
}

const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return '#07c160'
  if (percentage >= 60) return '#ff976a'
  return '#ee0a24'
}

const getPartQuestions = (partNumber: number): QuestionResult[] => {
  return questionResults.value.filter((q) => {
    // Questions 1-10 = Part 1, 11-20 = Part 2, etc.
    const startQ = (partNumber - 1) * 10 + 1
    const endQ = partNumber * 10
    return q.questionId >= startQ && q.questionId <= endQ
  })
}

const formatAnswer = (answer: string | string[]): string => {
  if (Array.isArray(answer)) return answer.join(', ')
  if (!answer) return 'Not answered'
  return answer
}

const retakeTest = () => {
  listeningStore.resetTest()
  router.push({ name: 'listening-intro' })
}

const goHome = () => {
  router.push({ name: 'home' })
}

// Lifecycle
onMounted(() => {
  if (!testResult.value) {
    showToast({
      message: 'No test result found',
      type: 'fail',
    })
    router.push({ name: 'home' })
  }
})
</script>

<template>
  <div class="listening-results-view">
    <!-- Header -->
    <div class="listening-results-view__header">
      <button class="back-button" @click="goHome">
        <img src="@/assets/icons/arrow-left.svg" alt="Back" />
      </button>
      <span class="title">Test Results</span>
      <div class="spacer" />
    </div>

    <!-- Content -->
    <div class="listening-results-view__content">
      <!-- Main Score Card -->
      <div class="score-card">
        <div class="score-badge">
          <div class="band-score">{{ bandScore }}</div>
          <div class="band-label">Band Score</div>
        </div>

        <div class="score-circle">
          <van-circle
            v-model:current-rate="accuracyRate"
            :rate="accuracyRate"
            :speed="100"
            :stroke-width="60"
            layer-color="#f5f5f5"
            :color="scoreColor"
            size="200px"
            :text="accuracyText"
          />
        </div>

        <div class="score-details">
          <div class="score-item">
            <span class="label">Correct Answers</span>
            <span class="value">{{ correctAnswers }}/{{ totalQuestions }}</span>
          </div>
          <div class="score-item">
            <span class="label">Accuracy</span>
            <span class="value">{{ accuracy }}%</span>
          </div>
          <div class="score-item">
            <span class="label">Time Taken</span>
            <span class="value">{{ formattedTime }}</span>
          </div>
        </div>
      </div>

      <!-- Part Breakdown -->
      <div class="parts-breakdown">
        <h3 class="section-title">Performance by Part</h3>
        <div v-for="part in partResults" :key="part.partNumber" class="part-result-card">
          <div class="part-header">
            <span class="part-number">Part {{ part.partNumber }}</span>
            <span class="part-score">{{ part.correctAnswers }}/{{ part.totalQuestions }}</span>
          </div>
          <van-progress
            :percentage="getPartPercentage(part)"
            :stroke-width="8"
            :color="getProgressColor(getPartPercentage(part))"
            :show-pivot="false"
          />
        </div>
      </div>

      <!-- Question Review Section -->
      <div class="question-review">
        <h3 class="section-title">Answer Review</h3>

        <van-collapse v-model="activeReviewPart" accordion>
          <van-collapse-item v-for="part in 4" :key="part" :name="part" :title="`Part ${part}`">
            <div
              v-for="question in getPartQuestions(part)"
              :key="question.questionId"
              class="question-review-item"
              :class="{ correct: question.isCorrect, incorrect: !question.isCorrect }"
            >
              <div class="question-header">
                <span class="question-number">Q{{ question.questionId }}</span>
                <span v-if="question.isCorrect" class="check-icon">✓</span>
                <span v-else class="cross-icon">✗</span>
              </div>
              <div class="answer-comparison">
                <div class="answer-row">
                  <span class="label">Your answer:</span>
                  <span class="user-answer" :class="{ correct: question.isCorrect, incorrect: !question.isCorrect }">
                    {{ formatAnswer(question.userAnswer) }}
                  </span>
                </div>
                <div v-if="!question.isCorrect" class="answer-row">
                  <span class="label">Correct answer:</span>
                  <span class="correct-answer">{{ formatAnswer(question.correctAnswer) }}</span>
                </div>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <van-button type="primary" block size="large" @click="retakeTest"> Retake Test </van-button>
        <van-button block size="large" @click="goHome"> Back to Home </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.listening-results-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #8b5cf6 0%, #a855f7 100%);
  padding-bottom: env(safe-area-inset-bottom);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 20px;
    color: #fff;

    .back-button {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 24px;
        height: 24px;
        filter: brightness(0) invert(1);
      }
    }

    .title {
      font-size: 18px;
      font-weight: 600;
    }

    .spacer {
      width: 40px;
    }
  }

  &__content {
    padding: 0 16px 24px;
  }
}

.score-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .score-badge {
    text-align: center;
    margin-bottom: 24px;

    .band-score {
      font-size: 48px;
      font-weight: 700;
      color: #333;
      line-height: 1;
      margin-bottom: 8px;
    }

    .band-label {
      font-size: 14px;
      color: #666;
    }
  }

  .score-circle {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;

    :deep(.van-circle__text) {
      font-size: 24px;
      font-weight: 600;
    }
  }

  .score-details {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .score-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f7f8fa;
      border-radius: 8px;

      .label {
        font-size: 14px;
        color: #666;
      }

      .value {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    }
  }
}

.parts-breakdown {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
  }

  .part-result-card {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .part-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .part-number {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .part-score {
        font-size: 14px;
        font-weight: 600;
        color: #666;
      }
    }
  }
}

.question-review {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
  }

  :deep(.van-collapse-item__title) {
    font-weight: 500;
    color: #333;
  }

  :deep(.van-collapse-item__content) {
    padding: 12px 16px;
    background: #f7f8fa;
  }

  .question-review-item {
    padding: 12px;
    margin-bottom: 12px;
    background: #fff;
    border-radius: 8px;
    border-left: 4px solid #e5e5e5;

    &.correct {
      border-left-color: #07c160;
    }

    &.incorrect {
      border-left-color: #ee0a24;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .question-number {
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }

      .check-icon,
      .cross-icon {
        font-size: 18px;
        font-weight: 700;
      }

      .check-icon {
        color: #07c160;
      }

      .cross-icon {
        color: #ee0a24;
      }
    }

    .answer-comparison {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .answer-row {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
          font-size: 12px;
          color: #999;
        }

        .user-answer {
          font-size: 14px;
          font-weight: 500;
          padding: 8px;
          background: #f7f8fa;
          border-radius: 4px;

          &.correct {
            color: #07c160;
            background: #f0f9f4;
          }

          &.incorrect {
            color: #ee0a24;
            background: #fff1f0;
          }
        }

        .correct-answer {
          font-size: 14px;
          font-weight: 500;
          color: #07c160;
          padding: 8px;
          background: #f0f9f4;
          border-radius: 4px;
        }
      }
    }
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;

  :deep(.van-button) {
    border-radius: 12px;
    font-weight: 500;
  }

  :deep(.van-button--primary) {
    background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
    border: none;
  }

  :deep(.van-button:not(.van-button--primary)) {
    background: #fff;
    border: 1px solid #e5e5e5;
    color: #333;
  }
}
</style>
