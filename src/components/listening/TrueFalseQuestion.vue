<template>
  <div class="true-false-question">
    <div class="true-false-question__text-content">
      <div class="true-false-question__number">{{ question.id }}.</div>
      <p class="true-false-question__text">{{ question.question }}</p>
    </div>
    <div class="true-false-question__content">
      <div class="true-false-question__options">
        <button
          v-for="option in options"
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
  </div>
</template>

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
</script>
˝

<style scoped lang="scss">
.true-false-question {
  margin-bottom: 24px;

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
    margin-bottom: 8px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 12px;
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
    flex-direction: row;
    gap: 8px;
    flex-wrap: nowrap;
  }
}

.option-pill {
  flex: 1;
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
    line-height: 1.4;
  }

  &__indicator {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1.5px solid #d0d0d0;
    background: #fff;
    position: relative;
  }

  &--selected &__indicator {
    background: var(--color-primary);
    border-color: var(--color-primary);

    &::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 6px;
      width: 6px;
      height: 10px;
      border: 2px solid #fff;
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
    }
  }
}
</style>
