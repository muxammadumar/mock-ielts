<script setup lang="ts">
import { computed } from 'vue'
import type { FillInBlankQuestion, Answer } from '@/types/listening'

interface Props {
  question: FillInBlankQuestion
  answer?: Answer
}

const props = defineProps<Props>()

const emit = defineEmits<{
  answerChange: [value: string]
}>()

const inputValue = computed({
  get: () => {
    if (!props.answer) return ''
    return typeof props.answer.value === 'string' ? props.answer.value : ''
  },
  set: (value: string) => {
    emit('answerChange', value)
  },
})

const instruction = 'Complete the notes below. Write no more than two words and/or a number for each answer.'
</script>

<template>
  <div class="fill-in-blank-question">
    <div v-if="question.id === 1" class="fill-in-blank-question__instruction">
      {{ instruction }}
    </div>
    <div class="fill-in-blank-question__number">{{ question.id }}.</div>
    <div class="fill-in-blank-question__content">
      <p class="fill-in-blank-question__text">{{ question.question }}</p>
      <van-field
        v-model="inputValue"
        :placeholder="`Answer for question ${question.id}`"
        class="fill-in-blank-question__input"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.fill-in-blank-question {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--color-background-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &__instruction {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  &__number {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: 8px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__text {
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text-primary);
    margin: 0;
  }

  &__input {
    :deep(.van-field__control) {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      background-color: #fafafa;
      transition: all 0.2s ease;

      &:focus {
        border-color: var(--color-primary);
        background-color: var(--color-background-white);
      }
    }
  }
}
</style>
