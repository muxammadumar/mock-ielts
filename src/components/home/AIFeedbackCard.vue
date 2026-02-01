<template>
  <div class="ai-feedback-card" @click="handleClick">
    <div class="ai-feedback-card__icon-wrapper">
      <Icon name="recommendation-icon" size="40px" />
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
  border-radius: 24px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: var(--shadow-sm);
  }

  &__icon-wrapper {
    width: 40px;
    height: 40px;
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
    font-size: 12px;
    font-weight: medium;
    color: #5c5c5c;
    text-transform: uppercase;
    line-height: 12px;
  }

  &__subtitle {
    font-size: 16px;
    font-weight: bold;
    color: #171717;
    line-height: 24px;
  }

  &__chevron {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
}
</style>
