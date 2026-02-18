<script setup lang="ts">
import type { Question, Answer } from '@/types/listening'
import ReadingFillInBlank from './ReadingFillInBlank.vue'
import ReadingMultipleChoice from './ReadingMultipleChoice.vue'
import TrueFalseQuestion from '@/components/listening/TrueFalseQuestion.vue'

interface Props {
  questions: Question[]
  answers: Record<number, Answer>
  instruction: string
}

defineProps<Props>()

const emit = defineEmits<{
  answerChange: [questionId: number, value: string | string[]]
}>()

const handleAnswerChange = (questionId: number, value: string | string[]) => {
  emit('answerChange', questionId, value)
}
</script>

<template>
  <div class="reading-questions-list">
    <div class="reading-questions-list__header">
      <p class="reading-questions-list__subtitle">
        QUESTIONS {{ questions[0]?.id }}-{{ questions[questions.length - 1]?.id }}
      </p>
      <p class="reading-questions-list__instruction">{{ instruction }}</p>
    </div>

    <template v-for="question in questions" :key="question.id">
      <ReadingMultipleChoice
        v-if="question.type === 'multiple-choice'"
        :question="question"
        :answer="answers[question.id]"
        @answer-change="value => handleAnswerChange(question.id, value)"
      />
      <ReadingFillInBlank
        v-else-if="question.type === 'fill-in-blank'"
        :question="question"
        :answer="answers[question.id]"
        @answer-change="value => handleAnswerChange(question.id, value)"
      />
      <TrueFalseQuestion
        v-else-if="question.type === 'true-false-ng'"
        :question="question"
        :answer="answers[question.id]"
        @answer-change="value => handleAnswerChange(question.id, value)"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.reading-questions-list {
  background-color: #fff;
  border-radius: 24px;
  padding: 20px;
  &__header {
    margin-bottom: 24px;
  }

  &__subtitle {
    font-size: 14px;
    font-weight: 500;
    color: #5c5c5c;
    letter-spacing: 0.02em;
    line-height: 20px;
    margin: 0 0 12px 0;
    text-transform: uppercase;
  }

  &__instruction {
    font-size: 16px;
    font-weight: 500;
    color: #5c5c5c;
    line-height: 20px;
    margin: 0;
    letter-spacing: 0.02em;
  }
}
</style>
