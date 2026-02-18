<script setup lang="ts">
import TestNavHeader from '@/components/common/TestNavHeader.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

interface Props {
  title: string
  buttonText: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

defineEmits<{ back: []; start: [] }>()
</script>

<template>
  <div class="test-intro-layout">
    <TestNavHeader :title="title" @back="$emit('back')" />
    <div class="test-intro-layout__content">
      <slot />
    </div>
    <PrimaryButton
      style="padding-left: 16px; padding-right: 16px"
      :loading="loading"
      @click="$emit('start')"
    >
      {{ buttonText }}
    </PrimaryButton>
  </div>
</template>

<style scoped lang="scss">
.test-intro-layout {
  width: 100%;
  height: 100%;
  background-color: #ede8f8;
  display: flex;
  flex-direction: column;

  &__content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
