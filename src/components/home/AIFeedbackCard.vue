<template>
  <div class="ai-feedback-card" @click="handleClick">
    <div class="ai-feedback-card__icon-wrapper">
      <Icon name="star" size="24px" color="#ffffff" />
    </div>
    <div class="ai-feedback-card__content">
      <div class="ai-feedback-card__label">{{ $t('pages.home.aiFeedback') }}</div>
      <div class="ai-feedback-card__subtitle">{{ $t('pages.home.recommendations') }}</div>
    </div>
    <div class="ai-feedback-card__chevron">
      <Icon name="chevron-right" size="20px" color="var(--color-text-secondary)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'

const handleClick = () => {
  // Navigate to feedback page or show placeholder
  // For now, just log - can be updated when feedback page is created
  console.log('Navigate to AI Feedback page')
}
</script>

<style scoped lang="scss">
.ai-feedback-card {
  background-color: var(--color-background-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: var(--shadow-sm);
  }

  &__icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--color-primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__content {
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

  &__subtitle {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary-black);
    line-height: var(--line-height-normal);
  }

  &__chevron {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
}
</style>
