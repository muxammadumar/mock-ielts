<script setup lang="ts">
import type { Question, Answer } from '@/types/listening'
import FillInBlankQuestion from './FillInBlankQuestion.vue'
import MultipleChoiceQuestion from './MultipleChoiceQuestion.vue'
import TrueFalseQuestion from './TrueFalseQuestion.vue'

interface Props {
  questions: Question[]
  answers: Record<number, Answer>
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
  <div class="questions-list">
    <template v-for="question in questions" :key="question.id">
      <FillInBlankQuestion
        v-if="question.type === 'fill-in-blank'"
        :question="question"
        :answer="answers[question.id]"
        @answer-change="(value) => handleAnswerChange(question.id, value)"
      />
      <MultipleChoiceQuestion
        v-else-if="question.type === 'multiple-choice'"
        :question="question"
        :answer="answers[question.id]"
        @answer-change="(value) => handleAnswerChange(question.id, value)"
      />
      <TrueFalseQuestion
        v-else-if="question.type === 'true-false-ng'"
        :question="question"
        :answer="answers[question.id]"
        @answer-change="(value) => handleAnswerChange(question.id, value)"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
