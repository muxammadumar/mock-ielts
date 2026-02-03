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
  border: 1px solid #ebebeb;
  border-radius: 16px;
  overflow: hidden;

  &__button {
    flex: 1;
    padding: 4px 0;
    border: none;
    border-right: 1px solid #ebebeb;
    background-color: var(--color-background-white);
    color: #5c5c5c;
    font-size: 12px;
    line-height: 16px;
    font-weight: medium;
    cursor: pointer;
    transition: all 0.2s ease;

    &.active {
      background-color: #f7f7f7;
      color: #171717;
    }

    &:last-child {
      border-right: none;
    }
  }
}
</style>
