<template>
  <div class="test-nav-header">
    <button class="test-nav-header__back" @click="$emit('back')">
      <Icon name="arrow-left" size="24px" />
    </button>
    <h2 class="test-nav-header__title">{{ title }}</h2>
    <div class="test-nav-header__spacer" />
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'

interface Props {
  title: string
}

defineProps<Props>()
defineEmits<{ back: [] }>()
</script>

<style scoped lang="scss">
.test-nav-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  flex-shrink: 0;

  &__back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0;
  }

  &__title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #171717;
    margin: 0;
    line-height: 24px;
  }

  &__spacer {
    width: 36px;
    flex-shrink: 0;
  }
}
</style>
