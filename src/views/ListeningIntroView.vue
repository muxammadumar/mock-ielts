<script setup lang="ts">
import { useRouter } from 'vue-router'
import UserHeader from '@/components/common/UserHeader.vue'
import { useListeningStore } from '@/stores/useListeningStore'

const router = useRouter()
const listeningStore = useListeningStore()

const points = 100

const startTest = () => {
  // Reset test state
  listeningStore.resetTest()
  // Navigate to test page (timer will start in ListeningTestView)
  router.push({ name: 'listening-test' })
}
</script>

<template>
  <div class="listening-intro-view">
    <UserHeader :points="points" />
    <div class="listening-intro-view__content">
      <h1 class="listening-intro-view__title">IELTS Listening Test</h1>
      <p class="listening-intro-view__subtitle">Enhance concentration + audio skills</p>

      <div class="listening-intro-view__info-card">
        <div class="listening-intro-view__info-item">
          <Icon name="book-gray" size="40px" />
          <div class="listening-intro-view__info-content">
            <p class="listening-intro-view__info-value">40</p>
            <p class="listening-intro-view__info-title">LISTENING QUESTIONS</p>
          </div>
        </div>
        <div class="listening-intro-view__info-item">
          <Icon name="time-gray" size="40px" />
          <div class="listening-intro-view__info-content">
            <p class="listening-intro-view__info-value">30 mins + 10 mins</p>
            <p class="listening-intro-view__info-title">AUDIO DURATION + TRANSFER TIME (SIMULATED)</p>
          </div>
        </div>
      </div>

      <div class="listening-intro-view__rules-card">
        <h3 class="listening-intro-view__rules-title">Before you start</h3>
        <ul class="listening-intro-view__rules-list">
          <li>You must wear headphones or be in a quiet place for clear audio.</li>
          <li>Audio will play only once — just like in the real exam.</li>
          <li>You cannot pause, rewind, or replay the audio.</li>
          <li>Answers must be selected while listening; transfer time is included.</li>
          <li>Your final score will be auto-calculated after submission.</li>
        </ul>
      </div>

      <van-button
        type="primary"
        block
        size="large"
        class="listening-intro-view__start-button"
        @click="startTest"
      >
        Start listening test
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.listening-intro-view {
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
