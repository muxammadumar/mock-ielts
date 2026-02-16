<template>
  <div v-if="!inline" class="primary-button-wrapper">
    <button
      class="primary-button"
      :disabled="disabled || loading"
      @click="$emit('click')"
    >
      <slot>{{ loading ? 'Loading...' : '' }}</slot>
    </button>
  </div>
  <button
    v-else
    class="primary-button"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <slot>{{ loading ? 'Loading...' : '' }}</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  loading?: boolean
  inline?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  inline: false,
})

defineEmits<{ click: [] }>()
</script>

<style scoped lang="scss">
.primary-button-wrapper {
  flex-shrink: 0;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}

.primary-button {
  width: 100%;
  height: 56px;
  background-color: var(--color-primary);
  color: #ffffff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  transition: opacity 0.2s;

  &:active:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
