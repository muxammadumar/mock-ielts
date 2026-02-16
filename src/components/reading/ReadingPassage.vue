<script setup lang="ts">
import type { ReadingPassage } from '@/types/reading'

interface Props {
  passage: ReadingPassage
  isCollapsed: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggleCollapse: []
}>()
</script>

<template>
  <div class="reading-passage">
    <div class="reading-passage__header" @click="emit('toggleCollapse')">
      <div class="reading-passage__header-text">
        <p v-if="passage.subtitle" class="reading-passage__subtitle">
          {{ passage.subtitle }} &ndash; {{ passage.title }}
        </p>
        <p v-else class="reading-passage__subtitle">{{ passage.title }}</p>
      </div>
      <Icon
        name="chevron-right"
        size="20px"
        color="#171717"
        class="reading-passage__chevron"
        :class="{ 'reading-passage__chevron--collapsed': isCollapsed }"
      />
    </div>
    <div v-show="!isCollapsed" class="reading-passage__body">
      <div
        v-for="para in passage.paragraphs"
        :key="para.label"
        class="reading-passage__paragraph"
      >
        <p class="reading-passage__paragraph-text">
          <span class="reading-passage__paragraph-label">{{ para.label }}.</span>
          {{ para.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reading-passage {
  background-color: #fff;
  border-radius: 24px;
  padding: 20px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    gap: 12px;
  }

  &__header-text {
    flex: 1;
  }

  &__subtitle {
    font-size: 18px;
    font-weight: 700;
    color: #171717;
    line-height: 24px;
    margin: 0;
    letter-spacing: -0.015em;
  }

  &__chevron {
    flex-shrink: 0;
    transform: rotate(90deg);
    transition: transform 0.2s ease;

    &--collapsed {
      transform: rotate(0deg);
    }
  }

  &__body {
    margin-top: 16px;
  }

  &__paragraph {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__paragraph-text {
    font-size: 16px;
    font-weight: 500;
    color: #5c5c5c;
    line-height: 24px;
    margin: 0;
    letter-spacing: -0.015em;
  }

  &__paragraph-label {
    font-weight: 700;
    color: #171717;
  }
}
</style>
