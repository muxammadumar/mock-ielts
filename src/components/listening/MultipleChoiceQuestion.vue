<template>
  <div class="multiple-choice-question">
    <div v-if="question.id === 11" class="multiple-choice-question__instruction">
      {{ instruction }}
    </div>
    <div class="multiple-choice-question__text-content">
      <div class="multiple-choice-question__number">{{ question.id }}.</div>
      <p class="multiple-choice-question__text">{{ question.question }}</p>
    </div>
    <div class="multiple-choice-question__options">
      <button
        v-for="option in question.options"
        :key="option.value"
        class="option-pill"
        :class="{ 'option-pill--selected': selectedValue === option.value }"
        @click="selectedValue = option.value"
      >
        <span class="option-pill__label">{{ option.label }}</span>
        <Icon name="checked" size="24px" color="#fff" v-if="selectedValue === option.value" />
        <Icon v-else name="check" size="24px" color="#fff" />
      </button>
    </div>
  </div>
</template>

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

const instruction =
  'Complete the notes below. Write no more than two words and/or a number for each answer.'
</script>

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

  &__text-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__number {
    font-size: 15px;
    font-weight: 600;
    color: #171717;
    flex-shrink: 0;
  }

  &__text {
    font-size: 18px;
    line-height: 28px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.option-pill {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:active {
    background: #ede8fa;
  }

  &__label {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: #171717;
  }
}
</style>
