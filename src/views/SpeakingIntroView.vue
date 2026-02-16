<script setup lang="ts">
import { useRouter } from 'vue-router'
import TestNavHeader from '@/components/common/TestNavHeader.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { useSpeakingStore } from '@/stores/useSpeakingStore'
import { useAttemptStore } from '@/stores/useAttemptStore'

const router = useRouter()
const speakingStore = useSpeakingStore()
const attemptStore = useAttemptStore()

const startTest = () => {
  if (!attemptStore.attemptId) {
    speakingStore.resetTest()
  }
  router.push({ name: 'speaking-test' })
}
</script>

<template>
  <div class="speaking-intro-view">
    <TestNavHeader title="Speaking test" @back="router.back()" />
    <div class="speaking-intro-view__content">
      <div class="speaking-intro-view__info-card">
        <h1 class="speaking-intro-view__card-title">IELTS Speaking Test</h1>
        <p class="speaking-intro-view__card-subtitle">Practice your spoken English fluency</p>
        <div class="speaking-intro-view__info-item">
          <Icon name="book-gray" size="40px" />
          <div class="speaking-intro-view__info-content">
            <p class="speaking-intro-view__info-value">3 Parts</p>
            <p class="speaking-intro-view__info-label">STRUCTURED INTERVIEW FORMAT</p>
          </div>
        </div>
        <div class="speaking-intro-view__info-item">
          <Icon name="time-gray" size="40px" />
          <div class="speaking-intro-view__info-content">
            <p class="speaking-intro-view__info-value">11–14 mins</p>
            <p class="speaking-intro-view__info-label">TOTAL DURATION</p>
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
    </div>

    <PrimaryButton @click="startTest">Start speaking test</PrimaryButton>
  </div>
</template>

<style scoped lang="scss">
.speaking-intro-view {
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
