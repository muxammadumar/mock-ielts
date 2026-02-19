<script setup lang="ts">
import { useRouter } from 'vue-router'
import TestIntroLayout from '@/components/common/TestIntroLayout.vue'
import { useListeningStore } from '@/stores/useListeningStore'
import { useAttemptStore } from '@/stores/useAttemptStore'

const router = useRouter()
const listeningStore = useListeningStore()
const attemptStore = useAttemptStore()

const startTest = () => {
  if (!attemptStore.attemptId) {
    listeningStore.resetTest()
  }
  router.push({ name: 'listening-test' })
}
</script>

<template>
  <TestIntroLayout title="Listening test" buttonText="Start listening test" @back="router.back()" @start="startTest">
    <div class="listening-intro-view__info-card">
      <h1 class="listening-intro-view__card-title">IELTS Listening Test</h1>
      <p class="listening-intro-view__card-subtitle">Enhance concentration + audio skills</p>
      <div class="listening-intro-view__info-item">
        <Icon name="book-gray" size="40px" />
        <div class="listening-intro-view__info-content">
          <p class="listening-intro-view__info-value">40</p>
          <p class="listening-intro-view__info-label">LISTENING QUESTIONS</p>
        </div>
      </div>
      <div class="listening-intro-view__info-item">
        <Icon name="time-gray" size="40px" />
        <div class="listening-intro-view__info-content">
          <p class="listening-intro-view__info-value">30 mins + 10 mins</p>
          <p class="listening-intro-view__info-label">AUDIO DURATION + TRANSFER TIME (SIMULATED)</p>
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
  </TestIntroLayout>
</template>

<style scoped lang="scss">
.listening-intro-view {
  &__info-card {
    background-color: #ffffff;
    border-radius: 24px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__card-title {
    font-size: 18px;
    font-weight: 700;
    color: #171717;
    margin: 0;
    line-height: 24px;
  }

  &__card-subtitle {
    font-size: 14px;
    font-weight: 400;
    color: #5c5c5c;
    margin: -8px 0 0 0;
    line-height: 20px;
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

  &__info-label {
    font-size: 11px;
    font-weight: 400;
    color: #5c5c5c;
    line-height: 14px;
    margin: 0;
    text-transform: uppercase;
  }

  &__rules-card {
    background-color: #ffffff;
    border-radius: 24px;
    padding: 20px;
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
      color: #5c5c5c;
      line-height: 20px;
    }
  }
}
</style>
