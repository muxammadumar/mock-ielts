<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  minWords: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const wordCount = computed(() => {
  return props.modelValue.trim().split(/\s+/).filter(Boolean).length
})

const isMinMet = computed(() => wordCount.value >= props.minWords)
</script>

<template>
  <div class="writing-answer-input">
    <p class="writing-answer-input__label">WRITE THE ANSWER</p>
    <textarea
      class="writing-answer-input__textarea"
      :value="props.modelValue"
      placeholder="Start writing here..."
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <div class="writing-answer-input__footer">
      <span
        class="writing-answer-input__word-count"
        :class="{ 'writing-answer-input__word-count--met': isMinMet }"
      >
        {{ wordCount }} / MIN {{ props.minWords }} WORDS
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.writing-answer-input {
  background-color: var(--color-background-white);
  border-radius: 16px;
  padding: 16px;

  &__label {
    font-size: 11px;
    font-weight: 600;
    color: #5c5c5c;
    letter-spacing: 0.08em;
    margin: 0 0 12px 0;
    text-transform: uppercase;
  }

  &__textarea {
    width: 100%;
    min-height: 200px;
    border: none;
    border-bottom: 2px solid var(--color-primary);
    border-radius: 0;
    outline: none;
    resize: vertical;
    font-size: 15px;
    font-weight: 400;
    color: #171717;
    line-height: 24px;
    padding: 0 0 8px 0;
    background: transparent;
    box-sizing: border-box;
    caret-color: var(--color-primary);

    &::placeholder {
      color: #c0c0c0;
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }

  &__word-count {
    font-size: 11px;
    font-weight: 600;
    color: #9b9b9b;
    letter-spacing: 0.06em;
    text-transform: uppercase;

    &--met {
      color: #52c41a;
    }
  }
}
</style>
