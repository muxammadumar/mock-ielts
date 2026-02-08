<script setup lang="ts">
interface Props {
  partNumber: number
  subtitle: string
}

defineProps<Props>()
</script>

<template>
  <div class="part-indicator">
    <div class="part-indicator__title">PART {{ partNumber }}</div>
    <div class="part-indicator__subtitle">{{ subtitle }}</div>
  </div>
</template>

<style scoped lang="scss">
.part-indicator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 12px;
  margin-bottom: 12px;

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  &__subtitle {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-secondary);
  }
}
</style>
