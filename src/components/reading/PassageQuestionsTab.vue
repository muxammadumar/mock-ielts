<script setup lang="ts">
import type { ReadingTab } from '@/types/reading'

interface Props {
  activeTab: ReadingTab
}

defineProps<Props>()

const emit = defineEmits<{
  'update:activeTab': [tab: ReadingTab]
}>()
</script>

<template>
  <div class="passage-questions-tab">
    <button
      class="passage-questions-tab__button"
      :class="{ 'passage-questions-tab__button--active': activeTab === 'passage' }"
      @click="emit('update:activeTab', 'passage')"
    >
      Passage
    </button>
    <button
      class="passage-questions-tab__button"
      :class="{ 'passage-questions-tab__button--active': activeTab === 'questions' }"
      @click="emit('update:activeTab', 'questions')"
    >
      Questions
    </button>
  </div>
</template>

<style scoped lang="scss">
.passage-questions-tab {
  display: flex;
  background-color: #ffffff;
  border-radius: 100px;
  padding: 4px;

  &__button {
    flex: 1;
    border: none;
    border-radius: 100px;
    padding: 8px 0;
    font-size: 15px;
    font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    color: #090909;

    &--active {
      background-color: #fff;
      color: var(--color-primary);
      // font-weight: 700;
      // font-size: 17px;
      box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
