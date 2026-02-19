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
</script>

<template>
  <div class="reading-mc">
    <div class="reading-mc__text-content">
      <span class="reading-mc__number">{{ question.id }}.</span>
      <p class="reading-mc__text">{{ question.question }}</p>
    </div>
    <div class="reading-mc__options">
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

<style scoped lang="scss">
.reading-mc {
  margin-bottom: 24px;

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
    font-weight: 600;
    color: #171717;
    line-height: 28px;
    margin: 0;
    letter-spacing: -0.015em;
    text-align: justify;
  }

  &__options {
    display: flex;
    flex-direction: row;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.option-pill {
  width: calc(calc(100% / 3) - 8px);
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
