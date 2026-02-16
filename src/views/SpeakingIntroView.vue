<script setup lang="ts">
import { useRouter } from 'vue-router'
import UserHeader from '@/components/common/UserHeader.vue'
import { useSpeakingStore } from '@/stores/useSpeakingStore'
import { useAttemptStore } from '@/stores/useAttemptStore'

const router = useRouter()
const speakingStore = useSpeakingStore()
const attemptStore = useAttemptStore()

const points = 100

const startTest = () => {
  // Only reset test state if not in a full test flow
  if (!attemptStore.attemptId) {
    speakingStore.resetTest()
  }
  router.push({ name: 'speaking-test' })
}
</script>

<template>
  <div class="speaking-intro-view">
    <UserHeader :points="points" />
    <div class="speaking-intro-view__content">
      <h1 class="speaking-intro-view__title">IELTS Speaking Test</h1>
      <p class="speaking-intro-view__subtitle">Practice your spoken English fluency</p>

      <div class="speaking-intro-view__info-card">
        <div class="speaking-intro-view__info-item">
          <Icon name="book-gray" size="40px" />
          <div class="speaking-intro-view__info-content">
            <p class="speaking-intro-view__info-value">3 Parts</p>
            <p class="speaking-intro-view__info-title">STRUCTURED INTERVIEW FORMAT</p>
          </div>
        </div>
        <div class="speaking-intro-view__info-item">
          <Icon name="time-gray" size="40px" />
          <div class="speaking-intro-view__info-content">
            <p class="speaking-intro-view__info-value">11–14 mins</p>
            <p class="speaking-intro-view__info-title">TOTAL DURATION</p>
          </div>
        </div>
      </div>

      <div class="speaking-intro-view__rules-card">
        <h3 class="speaking-intro-view__rules-title">Before you start</h3>
        <ul class="speaking-intro-view__rules-list">
          <li>You have 2 minutes to answer each question — use the time fully.</li>
          <li>Speak clearly and at a natural pace; avoid rushing or long silences.</li>
          <li>Your microphone will be activated when you press the record button.</li>
          <li>You can pause and resume recording, but cannot re-record a question once submitted.</li>
          <li>You will be assessed on fluency, vocabulary, pronunciation, and grammar.</li>
        </ul>
      </div>

      <van-button
        type="primary"
        block
        size="large"
        class="speaking-intro-view__start-button"
        @click="startTest"
      >
        Start speaking test
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.speaking-intro-view {
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
    font-size: 28px;
    font-weight: 900;
    color: var(--color-text-primary-white);
    line-height: 36px;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 8px;
  }

  &__subtitle {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    margin-bottom: 24px;
  }

  &__info-card {
    background-color: var(--color-background-white);
    border-radius: 24px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 12px;
  }

  &__info-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__info-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__info-value {
    font-size: 16px;
    font-weight: 600;
    color: #171717;
    line-height: 24px;
    margin: 0;
  }

  &__info-title {
    font-size: 11px;
    font-weight: 400;
    color: #5c5c5c;
    line-height: 14px;
    margin: 0;
    text-transform: uppercase;
  }

  &__rules-card {
    background-color: var(--color-background-white);
    border-radius: 24px;
    padding: 20px;
    margin-bottom: 24px;
  }

  &__rules-title {
    font-size: 18px;
    font-weight: 700;
    color: #171717;
    line-height: 24px;
    margin: 0 0 16px 0;
  }

  &__rules-list {
    margin: 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
      font-size: 14px;
      font-weight: 400;
      color: var(--color-text-secondary);
      line-height: 20px;
    }
  }

  &__start-button {
    height: 56px;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 900;
  }
}
</style>
