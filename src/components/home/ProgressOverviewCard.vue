<template>
  <div class="progress-overview-card">
    <div class="progress-overview-card__header">
      <div class="progress-overview-card__icon-wrapper">
        <Icon name="clock" size="20px" color="#ffffff" />
      </div>
      <div class="progress-overview-card__title-section">
        <div class="progress-overview-card__label">{{ $t('pages.home.progressOverview') }}</div>
        <div class="progress-overview-card__date-score">
          {{ currentDate }} - {{ $t('pages.home.scoreBand') }} {{ scoreBand }}
        </div>
      </div>
    </div>
    <TimeRangeSelector @select="handleTimeRangeSelect" />
    <ProgressChart :data="progressData" :current-date="currentDate" />
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
import TimeRangeSelector from './TimeRangeSelector.vue'
import ProgressChart from './ProgressChart.vue'
import type { TimeRange } from '@/types/dashboard'

interface Props {
  progressData: Array<{ date: string; score: number; fullDate?: string }>
  currentDate: string
  scoreBand: number
}

defineProps<Props>()

const handleTimeRangeSelect = (range: TimeRange) => {
  // Handle time range selection
  // In real implementation, this would filter/refetch data based on range
  console.log('Selected time range:', range)
}
</script>

<style scoped lang="scss">
.progress-overview-card {
  background-color: var(--color-background-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--spacing-md);

  &__header {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  &__icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--color-primary-light);
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
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__date-score {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary-black);
    line-height: var(--line-height-tight);
  }
}
</style>
