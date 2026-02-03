<template>
  <div class="numeric-keypad">
    <div class="keypad-row">
      <button
        v-for="num in [1, 2, 3]"
        :key="num"
        class="keypad-key"
        :disabled="disabled"
        @click="handleInput(num.toString())"
      >
        <span class="key-number">{{ num }}</span>
        <span v-if="num > 1" class="key-letters">{{ getLetters(num) }}</span>
      </button>
    </div>
    <div class="keypad-row">
      <button
        v-for="num in [4, 5, 6]"
        :key="num"
        class="keypad-key"
        :disabled="disabled"
        @click="handleInput(num.toString())"
      >
        <span class="key-number">{{ num }}</span>
        <span class="key-letters">{{ getLetters(num) }}</span>
      </button>
    </div>
    <div class="keypad-row">
      <button
        v-for="num in [7, 8, 9]"
        :key="num"
        class="keypad-key"
        :disabled="disabled"
        @click="handleInput(num.toString())"
      >
        <span class="key-number">{{ num }}</span>
        <span class="key-letters">{{ getLetters(num) }}</span>
      </button>
    </div>
    <div class="keypad-row">
      <button class="keypad-key key-special" :disabled="disabled" @click="handleSpecial">
        <span class="key-text">+*#</span>
      </button>
      <button class="keypad-key key-zero" :disabled="disabled" @click="handleInput('0')">
        <span class="key-number">0</span>
      </button>
      <button class="keypad-key key-backspace" :disabled="disabled" @click="handleBackspace">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 6L16 12L22 18M16 12L2 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 4L2 10L8 16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  input: [digit: string]
  backspace: []
  special: []
}>()

const getLetters = (num: number): string => {
  const letters: Record<number, string> = {
    2: 'ABC',
    3: 'DEF',
    4: 'GHI',
    5: 'JKL',
    6: 'MNO',
    7: 'PQRS',
    8: 'TUV',
    9: 'WXYZ',
  }
  return letters[num] || ''
}

const handleInput = (digit: string) => {
  emit('input', digit)
}

const handleBackspace = () => {
  emit('backspace')
}

const handleSpecial = () => {
  emit('special')
}
</script>

<style scoped lang="scss">
.numeric-keypad {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background-color: #f7f8fa;
  border-top: 1px solid #ebedf0;
}

.keypad-row {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.keypad-key {
  flex: 1;
  min-width: 0;
  height: 56px;
  border: 1px solid #ebedf0;
  border-radius: 12px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  touch-action: manipulation;

  &:active:not(:disabled) {
    background-color: #f2f3f5;
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.key-number {
  font-size: 24px;
  font-weight: 600;
  color: #323233;
  line-height: 1;
}

.key-letters {
  font-size: 10px;
  font-weight: 400;
  color: #969799;
  margin-top: 2px;
  line-height: 1;
}

.key-text {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
}

.key-zero {
  flex: 2;
}

.key-backspace {
  svg {
    width: 24px;
    height: 24px;
    color: #323233;
  }
}
</style>
