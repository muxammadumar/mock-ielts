<script setup lang="ts">
import { computed } from 'vue'
import type { MultipleChoiceQuestion, Answer } from '@/types/listening'

interface Props {
  question: MultipleChoiceQuestion
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

const instruction = 'Complete the notes below. Write no more than two words and/or a number for each answer.'
</script>

<template>
  <div class="multiple-choice-question">
    <div v-if="question.id === 11" class="multiple-choice-question__instruction">
      {{ instruction }}
    </div>
    <div class="multiple-choice-question__number">{{ question.id }}.</div>
    <div class="multiple-choice-question__content">
      <p class="multiple-choice-question__text">{{ question.question }}</p>
      <van-radio-group v-model="selectedValue" class="multiple-choice-question__options">
        <div
          v-for="option in question.options"
          :key="option.value"
          class="multiple-choice-question__option"
        >
          <van-radio
            :name="option.value"
            class="multiple-choice-question__radio"
            icon-size="20px"
          >
            <div class="multiple-choice-question__option-content">
              <span class="multiple-choice-question__option-value">{{ option.value }}</span>
              <span class="multiple-choice-question__option-label">{{ option.label }}</span>
            </div>
          </van-radio>
        </div>
      </van-radio-group>
    </div>
  </div>
</template>

<style scoped lang="scss">
.multiple-choice-question {
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
    flex-direction: column;
    gap: 8px;
  }

  &__option {
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #fafafa;
    }
  }

  &__radio {
    width: 100%;

    :deep(.van-radio__label) {
      flex: 1;
      margin-left: 8px;
    }
  }

  &__option-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__option-value {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background-color: #f5f5f5;
    border-radius: 50%;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
    flex-shrink: 0;
  }

  &__option-label {
    font-size: 14px;
    color: var(--color-text-primary);
    line-height: 1.5;
  }
}
</style>
