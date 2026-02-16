<template>
  <div class="mock-test-view">
    <UserHeader :points="points" />
    <div class="mock-test-view__content">
      <h1 class="mock-test-view__title">Ready to practice today?</h1>
      <div class="mock-test-view__card">
        <h3 class="mock-test-view__card-title">IELTS Full Mock Test</h3>
        <p class="mock-test-view__card-description">Complete exam simulation</p>
        <div class="mock-test-view__card-items">
          <div class="mock-test-view__card-item">
            <Icon name="book-gray" size="40px" />
            <div class="mock-test-view__card-item-content">
              <p class="mock-test-view__card-item-value">40</p>
              <p class="mock-test-view__card-item-title">Total Questions (across sections)</p>
            </div>
          </div>
          <div class="mock-test-view__card-item">
            <Icon name="time-gray" size="40px" />
            <div class="mock-test-view__card-item-content">
              <p class="mock-test-view__card-item-value">2 hrs 45 mins</p>
              <p class="mock-test-view__card-item-title">Total Duration</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mock-test-view__grid">
        <div class="mock-test-view__grid-item">
          <Icon name="listening-icon" size="40px" />
          <p class="mock-test-view__grid-item-title">Listening</p>
        </div>
        <div class="mock-test-view__grid-item">
          <Icon name="reading-icon" size="40px" />
          <p class="mock-test-view__grid-item-title">Reading</p>
        </div>
        <div class="mock-test-view__grid-item">
          <Icon name="writing-icon" size="40px" />
          <p class="mock-test-view__grid-item-title">Writing</p>
        </div>
        <div class="mock-test-view__grid-item">
          <Icon name="speaking-icon" size="40px" />
          <p class="mock-test-view__grid-item-title">Speaking</p>
        </div>
      </div>
    </div>
    <PrimaryButton :loading="isLoading" @click="handleStartFullTest">
      Start full test
    </PrimaryButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import UserHeader from '@/components/common/UserHeader.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { useAttemptStore } from '@/stores/useAttemptStore'

const router = useRouter()
const attemptStore = useAttemptStore()
const points = 100
const isLoading = ref(false)

const handleStartFullTest = async () => {
  isLoading.value = true
  try {
    await attemptStore.initTest()
    const section = attemptStore.currentSection ?? 'listening'
    router.push({ name: `${section}-intro` })
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message ?? 'Failed to start test. Please try again.'
    showToast({ message, type: 'fail' })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.mock-test-view {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/home-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  &__content {
    flex: 1;
    padding: 24px 16px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  &__title {
    font-size: 32px;
    font-weight: 900;
    color: var(--color-text-primary-white);
    line-height: 42px;
    text-align: center;
    max-width: 250px;
    letter-spacing: -1.5%;
    margin: 0 auto;
    margin-bottom: 24px;
  }
  &__card {
    background-color: var(--color-background-white);
    border-radius: 24px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    &-title {
      font-size: 18px;
      font-weight: 700;
      color: #171717;
      line-height: 24px;
    }
    &-description {
      font-size: 14px;
      font-weight: 400;
      color: var(--color-text-secondary);
      line-height: 24px;
      margin-bottom: 16px;
    }
    &-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    &-item {
      display: flex;
      align-items: center;
      gap: 12px;
      &-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      &-value {
        font-size: 16px;
        font-weight: 600;
        color: #171717;
        line-height: 24px;
      }
      &-title {
        font-size: 12px;
        font-weight: 400;
        color: #5c5c5c;
        line-height: 12px;
      }
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
    &-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 24px;
      background-color: var(--color-background-white);
      cursor: default;

      &-title {
        font-size: 16px;
        font-weight: 600;
        color: #171717;
        line-height: 24px;
      }
    }
  }
}

</style>
