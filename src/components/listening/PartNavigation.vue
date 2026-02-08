<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPart: number
  totalParts: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  changePart: [partIndex: number]
}>()

const activeTab = computed({
  get: () => props.currentPart,
  set: (value: number) => emit('changePart', value),
})
</script>

<template>
  <div class="part-navigation">
    <van-tabs v-model:active="activeTab" :shrink="true" :sticky="false">
      <van-tab
        v-for="part in totalParts"
        :key="part - 1"
        :title="`Part ${part}`"
        :name="part - 1"
      />
    </van-tabs>
  </div>
</template>

<style scoped lang="scss">
.part-navigation {
  margin-bottom: 16px;

  :deep(.van-tabs__nav) {
    background-color: transparent;
  }

  :deep(.van-tab) {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  :deep(.van-tab--active) {
    color: var(--color-primary);
    font-weight: 600;
  }

  :deep(.van-tabs__line) {
    background-color: var(--color-primary);
  }
}
</style>
