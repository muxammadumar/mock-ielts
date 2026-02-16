<script setup lang="ts">
import type { SpeakingQuestion } from '@/types/speaking'

interface Props {
  question: SpeakingQuestion
  partNumber: number
  totalQuestions: number
}

const props = defineProps<Props>()
</script>

<template>
  <div class="speaking-question-card">
    <p class="speaking-question-card__label">
      QUESTION {{ props.question.questionNumber }}/{{ props.totalQuestions }}
    </p>
    <p class="speaking-question-card__topic">{{ props.question.topic }}</p>
    <p class="speaking-question-card__question">{{ props.question.question }}</p>
  </div>
</template>

<style scoped lang="scss">
.speaking-question-card {
  background-color: var(--color-background-white);
  border-radius: 24px;
  padding: 24px 20px;
  margin-bottom: 16px;

  &__label {
    font-size: 11px;
    font-weight: 600;
    color: var(--color-primary);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0 0 8px 0;
  }

  &__topic {
    font-size: 13px;
    font-weight: 500;
    color: #5c5c5c;
    margin: 0 0 12px 0;
    line-height: 18px;
  }

  &__question {
    font-size: 20px;
    font-weight: 700;
    color: #171717;
    line-height: 28px;
    margin: 0;
  }
}
</style>
