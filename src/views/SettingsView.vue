<template>
  <div class="settings-view">
    <UserHeader :points="100" />
    <div class="settings-view__content">
      <h1 class="settings-view__title">Settings</h1>
      <div class="settings-view__card">
        <div class="settings-view__card-item">
          <Icon name="profile-icon" size="44px" class="settings-view__card-item-icon" />
          <p class="settings-view__card-item-title">Personal data</p>
        </div>
        <div class="settings-view__card-item">
          <Icon name="theme-icon" size="44px" class="settings-view__card-item-icon" />
          <div class="settings-view__card-item-content">
            <p class="settings-view__card-item-title">Theme</p>
            <p class="settings-view__card-item-value">Light</p>
          </div>
        </div>
        <div class="settings-view__card-item">
          <Icon name="language-icon" size="44px" class="settings-view__card-item-icon" />
          <div class="settings-view__card-item-content">
            <p class="settings-view__card-item-title">Language</p>
            <p class="settings-view__card-item-value">English</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserHeader from '@/components/common/UserHeader.vue'
</script>

<style scoped lang="scss">
.settings-view {
  width: 100%;
  min-height: 100%;
  background-image: url('@/assets/images/home-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  &__content {
    flex: 1;
    padding: 24px 16px;
    padding-bottom: calc(12px + 80px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  &__title {
    font-size: 32px;
    font-weight: 700;
    color: var(--color-text-primary-white);
    line-height: 42px;
    letter-spacing: -1.5%;
    margin-bottom: 16px;
  }
  &__card {
    background-color: var(--color-background-white);
    border-radius: 32px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    gap: 16px;
    &-item {
      display: flex;
      align-items: center;
      gap: 12px;
      &-title {
        font-size: 16px;
        font-weight: 500;
        color: #171717;
        line-height: 24px;
        letter-spacing: -1.5%;
      }
      &-icon {
        min-width: 44px;
        min-height: 44px;
      }
      &-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 4px;
      }
      &-value {
        font-size: 14px;
        font-weight: 400;
        color: #171717;
        line-height: 20px;
        letter-spacing: -1.5%;
      }
    }
  }
}
</style>
