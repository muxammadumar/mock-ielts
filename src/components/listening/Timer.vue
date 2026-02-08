<script setup lang="ts">
import { computed } from 'vue'
import { formatTime } from '@/utils/formatTime'

interface Props {
  timeRemaining: number // in seconds
}

const props = defineProps<Props>()

const formattedTime = computed(() => formatTime(props.timeRemaining))
const isWarning = computed(() => props.timeRemaining < 5 * 60) // Less than 5 minutes
</script>

<template>
  <div class="timer" :class="{ 'timer--warning': isWarning }">
    {{ formattedTime }}
  </div>
</template>

<style scoped lang="scss">
.timer {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  padding: 8px 12px;
  background-color: var(--color-background-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &--warning {
    color: #ff4d4f;
    background-color: #fff1f0;
    border: 1px solid #ffccc7;
  }
}
</style>
