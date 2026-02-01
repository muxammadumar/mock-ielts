<template>
  <div class="skill-score-card">
    <div class="skill-score-card__icon-wrapper" :style="{ backgroundColor: color }">
      <Icon :name="icon" size="24px" color="#ffffff" />
    </div>
    <div class="skill-score-card__content">
      <div class="skill-score-card__label">{{ name }}</div>
      <div class="skill-score-card__score">{{ score.toFixed(1) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'

interface Props {
  name: string
  score: number
  icon: string
  color: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.skill-score-card {
  background-color: var(--color-background-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 120px;

  &__icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__content {
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

  &__score {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary-black);
    line-height: var(--line-height-tight);
  }
}
</style>
