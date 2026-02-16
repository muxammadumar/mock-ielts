<script setup lang="ts">
import { ref } from 'vue'
import type { WritingTask } from '@/types/writing'

interface Props {
  task: WritingTask
}

const props = defineProps<Props>()
const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="writing-task-card">
    <button class="writing-task-card__header" @click="toggleCollapse">
      <span class="writing-task-card__title">{{ props.task.title }}</span>
      <Icon
        name="chevron-down"
        size="20px"
        class="writing-task-card__chevron"
        :class="{ 'writing-task-card__chevron--rotated': !isCollapsed }"
      />
    </button>

    <div v-if="!isCollapsed" class="writing-task-card__body">
      <img
        v-if="props.task.imageUrl"
        :src="props.task.imageUrl"
        :alt="`Task ${props.task.taskNumber} diagram`"
        class="writing-task-card__image"
      />
      <p class="writing-task-card__description">{{ props.task.description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.writing-task-card {
  background-color: var(--color-background-white);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 12px;

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: none;
    border: none;
    cursor: pointer;
    gap: 8px;
  }

  &__title {
    font-size: 15px;
    font-weight: 700;
    color: #171717;
    line-height: 20px;
    text-align: left;
  }

  &__chevron {
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &--rotated {
      transform: rotate(180deg);
    }
  }

  &__body {
    padding: 0 16px 16px;
  }

  &__image {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 12px;
    object-fit: contain;
  }

  &__description {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-text-secondary);
    line-height: 22px;
    margin: 0;
    white-space: pre-line;
  }
}
</style>
