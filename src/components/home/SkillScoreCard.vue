<template>
  <div class="skill-score-card">
    <div class="skill-score-card__icon-wrapper">
      <Icon :name="icon" size="40px" />
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
  border-radius: 24px;
  padding: 16px;
  display: flex;
  gap: 12px;

  &__icon-wrapper {
    width: 40px;
    height: 40px;
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
    font-size: 12px;
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    line-height: 12px;
  }

  &__score {
    font-size: 18px;
    font-weight: bold;
    color: #171717;
    line-height: 24px;
  }
}
</style>
