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
</script>

<template>
  <div class="reading-fib">
    <p class="reading-fib__text">
      <span class="reading-fib__number">{{ question.id }}.</span>
      {{ question.question }}
    </p>
    <van-field
      v-model="inputValue"
      :placeholder="`Answer for question ${question.id}`"
      class="reading-fib__input"
    />
  </div>
</template>

<style scoped lang="scss">
.reading-fib {
  margin-bottom: 12px;

  &__text {
    font-size: 18px;
    font-weight: 600;
    color: #171717;
    line-height: 28px;
    margin: 0 0 12px 0;
    letter-spacing: -0.015em;
    text-align: justify;
  }

  &__number {
    font-weight: 600;
    color: #171717;
  }

  &__input {
    padding: 0px;
    :deep(.van-field__control) {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 16px;
      background-color: #fafafa;
      transition: all 0.2s ease;

      &:focus {
        border-color: var(--color-primary);
        background-color: #fff;
      }
    }
  }
}
</style>
