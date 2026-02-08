<template>
  <div class="otp-input">
    <input
      v-for="(_, index) in 6"
      :key="index"
      ref="inputRefs"
      v-model="values[index]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :class="['otp-field', { error: error, active: activeIndex === index }]"
      :disabled="disabled"
      @input="handleInput(index, $event)"
      @focus="activeIndex = index"
      @blur="activeIndex = -1"
      @paste="handlePaste"
      @keydown="handleKeydown(index, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  modelValue?: string
  error?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  error: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [value: string]
}>()

const values = ref<string[]>(['', '', '', '', '', ''])
const activeIndex = ref(-1)
const inputRefs = ref<(HTMLInputElement | null)[]>([])

const updateModelValue = () => {
  const code = values.value.join('')
  emit('update:modelValue', code)
  if (code.length === 6) {
    emit('complete', code)
  }
}

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^0-9]/g, '')

  if (value) {
    values.value[index] = value
    updateModelValue()

    // Move to next field
    if (index < 5) {
      nextTick(() => {
        inputRefs.value[index + 1]?.focus()
      })
    }
  } else {
    values.value[index] = ''
    updateModelValue()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 6)

  for (let i = 0; i < 6; i++) {
    values.value[i] = digits[i] || ''
  }

  updateModelValue()

  // Focus the last filled field or first empty field
  const lastFilledIndex = digits.length - 1
  const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
  nextTick(() => {
    inputRefs.value[focusIndex]?.focus()
  })
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !values.value[index] && index > 0) {
    // Move to previous field and clear it
    inputRefs.value[index - 1]?.focus()
    values.value[index - 1] = ''
    updateModelValue()
  }
}

const focus = () => {
  const firstEmptyIndex = values.value.findIndex(v => !v)
  const index = firstEmptyIndex === -1 ? 0 : firstEmptyIndex
  inputRefs.value[index]?.focus()
}

const clear = () => {
  values.value = ['', '', '', '', '', '']
  updateModelValue()
  focus()
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== values.value.join('')) {
      const digits = newValue.replace(/[^0-9]/g, '').slice(0, 6)
      for (let i = 0; i < 6; i++) {
        values.value[i] = digits[i] || ''
      }
    }
  },
  { immediate: true }
)

watch(
  () => props.error,
  () => {
    if (props.error) {
      // Clear on error
      nextTick(() => {
        clear()
      })
    }
  }
)

defineExpose({
  focus,
  clear,
})
</script>

<style scoped lang="scss">
.otp-input {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 20px;
}

.otp-field {
  width: 48px;
  height: 56px;
  border: 1px solid #ebedf0;
  border-radius: 12px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #323233;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #a175f0;
    box-shadow: 0 0 0 2px rgba(161, 117, 240, 0.1);
  }

  &.active {
    border-color: #a175f0;
  }

  &.error {
    border-color: #ee0a24;
  }

  &:disabled {
    background-color: #f7f8fa;
    cursor: not-allowed;
  }
}
</style>
