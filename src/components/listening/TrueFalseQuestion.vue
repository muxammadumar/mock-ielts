<script setup lang="ts">
import { computed } from 'vue'
import type { TrueFalseQuestion, Answer } from '@/types/listening'

interface Props {
  question: TrueFalseQuestion
  answer?: Answer
}

const props = defineProps<Props>()

const emit = defineEmits<{
  answerChange: [value: string]
}>()

const selectedValue = computed({
  get: () => {
    if (!props.answer) return ''
    return typeof props.answer.value === 'string' ? props.answer.value : ''
  },
  set: (value: string) => {
    emit('answerChange', value)
  },
})

const options = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
  { value: 'ng', label: 'NG' },
]

const instruction = 'Complete the notes below. Write no more than two words and/or a number for each answer.'
</script>

<template>
  <div class="true-false-question">
    <div v-if="question.id === 21" class="true-false-question__instruction">
      {{ instruction }}
    </div>
    <div class="true-false-question__number">{{ question.id }}.</div>
    <div class="true-false-question__content">
      <p class="true-false-question__text">{{ question.question }}</p>
      <van-radio-group v-model="selectedValue" class="true-false-question__options">
        <div
          v-for="option in options"
          :key="option.value"
          class="true-false-question__option"
        >
          <van-radio
            :name="option.value"
            class="true-false-question__radio"
            icon-size="20px"
          >
            {{ option.label }}
          </van-radio>
        </div>
      </van-radio-group>
    </div>
  </div>
</template>

<style scoped lang="scss">
.true-false-question {
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

  &__options {
    display: flex;
    flex-direction: row;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__option {
    flex: 1;
    min-width: 90px;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    transition: all 0.2s ease;
    text-align: center;

    &:hover {
      background-color: #fafafa;
    }
  }

  &__radio {
    width: 100%;
    justify-content: center;

    :deep(.van-radio__label) {
      margin-left: 6px;
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
