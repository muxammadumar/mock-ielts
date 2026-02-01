<template>
  <div class="user-header">
    <div class="user-header__avatar">
      <img
        v-if="props.avatarUrl"
        :src="props.avatarUrl"
        :alt="fullName"
        class="user-header__avatar-img"
      />
      <div v-else class="user-header__avatar-placeholder">
        {{ initials }}
      </div>
    </div>
    <div class="user-header__info">
      <div class="user-header__greeting">{{ $t('pages.home.greeting') }}</div>
      <div class="user-header__name">{{ fullName }}</div>
    </div>
    <div class="user-header__badge">
      <Icon name="badge" size="20px" color="#FFD700" />
      <span class="user-header__points">{{ props.points }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import Icon from '@/components/common/Icon.vue'

interface Props {
  points?: number
  avatarUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  points: 10,
  avatarUrl: undefined,
})

const authStore = useAuthStore()

const fullName = computed(() => {
  if (authStore.user) {
    return `${authStore.user.firstName} ${authStore.user.lastName}`
  }
  return 'Salima Karimova' // Fallback for demo
})

const initials = computed(() => {
  if (authStore.user) {
    const first = authStore.user.firstName.charAt(0).toUpperCase()
    const last = authStore.user.lastName.charAt(0).toUpperCase()
    return `${first}${last}`
  }
  return 'SK'
})
</script>

<style scoped lang="scss">
.user-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(
    180deg,
    var(--color-primary-light) 0%,
    rgba(161, 117, 240, 0.3) 100%
  );
  padding-top: calc(var(--safe-area-inset-top) + var(--spacing-md));

  &__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary-white);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    }
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__greeting {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    color: rgba(255, 255, 255, 0.8);
  }

  &__name {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary-white);
  }

  &__badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: var(--color-background-white);
    padding: 8px 12px;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
  }

  &__points {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary-black);
  }
}
</style>
