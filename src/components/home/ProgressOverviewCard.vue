<template>
  <div class="progress-overview-card">
    <div class="progress-overview-card__header">
      <div class="progress-overview-card__icon-wrapper">
        <Icon name="progress-clock" size="40px" />
      </div>
      <div class="progress-overview-card__title-section">
        <div class="progress-overview-card__label">{{ $t('pages.home.progressOverview') }}</div>
        <div class="progress-overview-card__date-score">
          {{ displayDate }} – {{ $t('pages.home.scoreBand') }} {{ displayBand }}
        </div>
      </div>
    </div>
    <TimeRangeSelector @select="handleTimeRangeSelect" />
    <ProgressChart
      :data="progressData"
      :active-index="selectedIndex"
      @select-point="selectedIndex = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '@/components/common/Icon.vue'
import TimeRangeSelector from './TimeRangeSelector.vue'
import ProgressChart from './ProgressChart.vue'
import type { TimeRange } from '@/types/dashboard'

interface Props {
  progressData: Array<{ date: string; score: number; fullDate?: string }>
  currentDate: string
  scoreBand: number
}

const props = defineProps<Props>()

const selectedIndex = ref(props.progressData.length - 1)

const selectedPoint = computed(() => props.progressData[selectedIndex.value])

const displayDate = computed(() => selectedPoint.value?.date ?? props.currentDate)

const displayBand = computed(() => {
  const score = selectedPoint.value?.score ?? props.scoreBand
  return Number.isInteger(score) ? score : score.toFixed(1)
})

const handleTimeRangeSelect = (range: TimeRange) => {
  console.log('Selected time range:', range)
}
</script>

<style scoped lang="scss">
.progress-overview-card {
  background-color: var(--color-background-white);
  border-radius: 32px;
  padding: 20px;
  margin-bottom: 16px;

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 20px;
  }

  &__icon-wrapper {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__title-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__label {
    font-size: 12px;
    font-weight: medium;
    color: #5c5c5c;
    text-transform: uppercase;
    letter-spacing: 2%;
    line-height: 12px;
  }

  &__date-score {
    font-size: 18px;
    font-weight: bold;
    color: #171717;
    line-height: 24px;
  }
}
</style>
