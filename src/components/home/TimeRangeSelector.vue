<template>
  <div class="time-range-selector">
    <button
      v-for="range in ranges"
      :key="range"
      :class="['time-range-selector__button', { active: selectedRange === range }]"
      @click="handleSelect(range)"
    >
      {{ range }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TimeRange } from '@/types/dashboard'

const emit = defineEmits<{
  select: [range: TimeRange]
}>()

const ranges: TimeRange[] = ['6D', '2W', '1M', '6M', '1Y']
const selectedRange = ref<TimeRange>('6D')

const handleSelect = (range: TimeRange) => {
  selectedRange.value = range
  emit('select', range)
}
</script>

<style scoped lang="scss">
.time-range-selector {
  display: flex;
  gap: 8px;
  margin-top: var(--spacing-sm);

  &__button {
    flex: 1;
    padding: 8px 12px;
    border-radius: var(--border-radius-sm);
    border: none;
    background-color: var(--color-background-white);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all 0.2s ease;

    &.active {
      background-color: #f2f3f5;
      color: var(--color-text-primary-white);
      font-weight: var(--font-weight-semibold);
    }

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
