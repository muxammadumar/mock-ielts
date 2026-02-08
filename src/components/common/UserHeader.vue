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
      <Icon name="rank-badge" size="20px" />
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
    return authStore.user.fullName
  }
  return 'Salima Karimova' // Fallback for demo
})

const initials = computed(() => {
  if (authStore.user?.fullName) {
    const names = authStore.user.fullName.split(' ')
    if (names.length >= 2) {
      return `${names[0].charAt(0).toUpperCase()}${names[names.length - 1].charAt(0).toUpperCase()}`
    }
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
  }
  return 'SK'
})
</script>

<style scoped lang="scss">
.user-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;

  &__avatar {
    width: 44px;
    height: 44px;
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
  }

  &__greeting {
    font-size: 14px;
    color: #ffffff;
    line-height: 22px;
  }

  &__name {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    line-height: 22px;
  }

  &__badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: var(--color-background-white);
    padding: 12px;
    border-radius: 12px;
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
