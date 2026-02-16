<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useListeningStore } from '@/stores/useListeningStore'
import { useReadingStore } from '@/stores/useReadingStore'
import TestNavHeader from '@/components/common/TestNavHeader.vue'

const router = useRouter()
const listeningStore = useListeningStore()
const readingStore = useReadingStore()

const listeningOpen = ref(true)
const readingOpen = ref(true)

const listeningResults = computed(() => listeningStore.testResult?.questionResults ?? [])
const readingResults = computed(() => readingStore.testResult?.questionResults ?? [])

const formatAnswer = (val: string | string[] | null | undefined): string => {
  if (!val) return '—'
  if (Array.isArray(val)) return val.join(', ') || '—'
  return val || '—'
}

const handleBack = () => router.back()
</script>

<template>
  <div class="answers-review">
    <TestNavHeader title="Answers review" @back="handleBack" />

    <div class="answers-review__scroll">
      <!-- LISTENING -->
      <div class="answers-review__card">
        <button class="answers-review__section-header" @click="listeningOpen = !listeningOpen">
          <div class="answers-review__section-icon-wrap answers-review__section-icon-wrap--blue">
            <Icon name="headphones" size="18px" />
          </div>
          <span class="answers-review__section-title">LISTENING</span>
          <span class="answers-review__count">{{ listeningResults.length }} questions</span>
          <svg
            class="answers-review__chevron"
            :class="{ 'answers-review__chevron--open': listeningOpen }"
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div v-if="listeningOpen" class="answers-review__section-body">
          <p v-if="!listeningResults.length" class="answers-review__empty">No results available.</p>
          <div
            v-for="(result, index) in listeningResults"
            :key="result.questionId"
            class="answers-review__question-row"
          >
            <span class="answers-review__q-number">{{ index + 1 }}</span>
            <div class="answers-review__answer-pair">
              <div class="answers-review__answer-col">
                <span
                  class="answers-review__answer-letter"
                  :class="result.isCorrect ? 'answers-review__answer-letter--correct' : 'answers-review__answer-letter--wrong'"
                >
                  {{ formatAnswer(result.userAnswer) }}
                </span>
                <span class="answers-review__answer-caption">YOUR ANSWER</span>
              </div>
              <div v-if="!result.isCorrect" class="answers-review__answer-col">
                <span class="answers-review__answer-letter answers-review__answer-letter--correct">
                  {{ formatAnswer(result.correctAnswer) }}
                </span>
                <span class="answers-review__answer-caption">RIGHT ANSWER</span>
              </div>
              <div v-else class="answers-review__answer-col">
                <span class="answers-review__correct-badge">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- READING -->
      <div class="answers-review__card">
        <button class="answers-review__section-header" @click="readingOpen = !readingOpen">
          <div class="answers-review__section-icon-wrap answers-review__section-icon-wrap--orange">
            <Icon name="book" size="18px" />
          </div>
          <span class="answers-review__section-title">READING</span>
          <span class="answers-review__count">{{ readingResults.length }} questions</span>
          <svg
            class="answers-review__chevron"
            :class="{ 'answers-review__chevron--open': readingOpen }"
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div v-if="readingOpen" class="answers-review__section-body">
          <p v-if="!readingResults.length" class="answers-review__empty">No results available.</p>
          <div
            v-for="(result, index) in readingResults"
            :key="result.questionId"
            class="answers-review__question-row"
          >
            <span class="answers-review__q-number">{{ index + 1 }}</span>
            <div class="answers-review__answer-pair">
              <div class="answers-review__answer-col">
                <span
                  class="answers-review__answer-letter"
                  :class="result.isCorrect ? 'answers-review__answer-letter--correct' : 'answers-review__answer-letter--wrong'"
                >
                  {{ formatAnswer(result.userAnswer) }}
                </span>
                <span class="answers-review__answer-caption">YOUR ANSWER</span>
              </div>
              <div v-if="!result.isCorrect" class="answers-review__answer-col">
                <span class="answers-review__answer-letter answers-review__answer-letter--correct">
                  {{ formatAnswer(result.correctAnswer) }}
                </span>
                <span class="answers-review__answer-caption">RIGHT ANSWER</span>
              </div>
              <div v-else class="answers-review__answer-col">
                <span class="answers-review__correct-badge">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- WRITING REVIEW -->
      <div class="answers-review__card">
        <div class="answers-review__section-header answers-review__section-header--static">
          <div class="answers-review__section-icon-wrap answers-review__section-icon-wrap--green">
            <Icon name="pencil" size="18px" />
          </div>
          <span class="answers-review__section-title">WRITING REVIEW</span>
        </div>
        <div class="answers-review__section-body answers-review__section-body--ai">
          <p class="answers-review__ai-title">Your essays have been analyzed by AI.</p>
          <ul class="answers-review__ai-list">
            <li>Task response and coherence scored</li>
            <li>Lexical resource and grammar evaluated</li>
            <li>Band score calculated based on IELTS criteria</li>
          </ul>
          <button class="answers-review__feedback-btn">View Feedback</button>
        </div>
      </div>

      <!-- SPEAKING REVIEW -->
      <div class="answers-review__card answers-review__card--last">
        <div class="answers-review__section-header answers-review__section-header--static">
          <div class="answers-review__section-icon-wrap answers-review__section-icon-wrap--pink">
            <Icon name="speech-bubble" size="18px" />
          </div>
          <span class="answers-review__section-title">SPEAKING REVIEW</span>
        </div>
        <div class="answers-review__section-body answers-review__section-body--ai">
          <p class="answers-review__ai-title">Your recording has been processed.</p>
          <ul class="answers-review__ai-list">
            <li>Fluency and pronunciation assessed</li>
            <li>Lexical resource and grammar scored</li>
            <li>Band score calculated based on IELTS criteria</li>
          </ul>
          <button class="answers-review__feedback-btn">View Feedback</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.answers-review {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ede8f8;

  &__scroll {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  }

  &__card {
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;

    &--last {
      margin-bottom: 8px;
    }
  }

  &__section-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;

    &--static {
      cursor: default;
    }
  }

  &__section-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--blue { background-color: #EEF2FF; }
    &--orange { background-color: #FFF7ED; }
    &--green { background-color: #F0FDF4; }
    &--pink { background-color: #FDF2F8; }
  }

  &__section-title {
    font-size: 13px;
    font-weight: 700;
    color: #171717;
    letter-spacing: 0.04em;
    flex: 1;
  }

  &__count {
    font-size: 12px;
    color: #9e9e9e;
  }

  &__chevron {
    color: #9e9e9e;
    transition: transform 0.2s;
    flex-shrink: 0;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__section-body {
    padding: 0 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 1px solid #f0f0f0;

    &--ai {
      padding-top: 16px;
    }
  }

  &__empty {
    font-size: 14px;
    color: #9e9e9e;
    margin: 0;
    text-align: center;
    padding: 8px 0;
  }

  &__question-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }
  }

  &__q-number {
    font-size: 13px;
    font-weight: 600;
    color: #9e9e9e;
    width: 24px;
    flex-shrink: 0;
    text-align: center;
  }

  &__answer-pair {
    display: flex;
    gap: 20px;
    flex: 1;
  }

  &__answer-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 48px;
  }

  &__answer-letter {
    font-size: 18px;
    font-weight: 700;
    line-height: 1;

    &--wrong {
      color: #ee0a24;
    }

    &--correct {
      color: #a175f0;
    }
  }

  &__answer-caption {
    font-size: 10px;
    color: #9e9e9e;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  &__correct-badge {
    font-size: 18px;
    color: #22c55e;
    font-weight: 700;
    line-height: 1;
  }

  &__ai-title {
    font-size: 14px;
    font-weight: 600;
    color: #171717;
    margin: 0;
  }

  &__ai-list {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    li {
      font-size: 13px;
      color: #5c5c5c;
      line-height: 1.5;
    }
  }

  &__feedback-btn {
    align-self: flex-start;
    padding: 8px 20px;
    border-radius: 24px;
    background-color: #f3eeff;
    border: 1px solid #d4baff;
    color: var(--color-primary, #7c3aed);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.7;
    }
  }
}
</style>
