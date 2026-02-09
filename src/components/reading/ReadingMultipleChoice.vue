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
    <p class="reading-mc__text">
      <span class="reading-mc__number">{{ question.id }}.</span>
      {{ question.question }}
    </p>
    <div class="reading-mc__grid">
      <button
        v-for="option in question.options"
        :key="option.value"
        class="reading-mc__option"
        :class="{ 'reading-mc__option--selected': selectedValue === option.value }"
        @click="selectedValue = option.value"
      >
        {{ option.value }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reading-mc {
  margin-bottom: 24px;

  &__text {
    font-size: 18px;
    font-weight: 600;
    color: #171717;
    line-height: 28px;
    margin: 0 0 16px 0;
    letter-spacing: -0.015em;
    text-align: justify;
  }

  &__number {
    font-weight: 600;
    color: #171717;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 48px;
    border-radius: 12px;
    border: 2px solid #e0e0e0;
    background: #fff;
    font-size: 16px;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.96);
    }

    &--selected {
      border-color: var(--color-primary);
      background-color: var(--color-primary);
      color: #fff;
    }
  }
}
</style>
