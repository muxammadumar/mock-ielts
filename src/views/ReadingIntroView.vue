<script setup lang="ts">
import { useRouter } from 'vue-router'
import TestIntroLayout from '@/components/common/TestIntroLayout.vue'
import { useReadingStore } from '@/stores/useReadingStore'
import { useAttemptStore } from '@/stores/useAttemptStore'

const router = useRouter()
const readingStore = useReadingStore()
const attemptStore = useAttemptStore()

const startTest = () => {
  if (!attemptStore.attemptId) {
    readingStore.resetTest()
  }
  router.push({ name: 'reading-test' })
}
</script>

<template>
  <TestIntroLayout title="Reading test" buttonText="Start reading test" @back="router.back()" @start="startTest">
    <div class="reading-intro-view__info-card">
      <h1 class="reading-intro-view__card-title">IELTS Reading Test</h1>
      <p class="reading-intro-view__card-subtitle">Improve comprehension skills</p>
      <div class="reading-intro-view__info-item">
        <Icon name="book-gray" size="40px" />
        <div class="reading-intro-view__info-content">
          <p class="reading-intro-view__info-value">40</p>
          <p class="reading-intro-view__info-label">READING QUESTIONS</p>
        </div>
      </div>
      <div class="reading-intro-view__info-item">
        <Icon name="time-gray" size="40px" />
        <div class="reading-intro-view__info-content">
          <p class="reading-intro-view__info-value">60 mins</p>
          <p class="reading-intro-view__info-label">TOTAL DURATION</p>
        </div>
      </div>
      <div class="reading-intro-view__info-item">
        <Icon name="rank-badge" size="40px" />
        <div class="reading-intro-view__info-content">
          <p class="reading-intro-view__info-value">True Band Estimate</p>
          <p class="reading-intro-view__info-label">BASED ON OFFICIAL IELTS CRITERIA</p>
        </div>
      </div>
    </div>

    <div class="reading-intro-view__rules-card">
      <h3 class="reading-intro-view__rules-title">Before you start</h3>
      <ul class="reading-intro-view__rules-list">
        <li>The test contains 3 reading passages with increasing difficulty.</li>
        <li>You must complete all questions within the 60-minute limit.</li>
        <li>No extra time will be provided for transferring answers.</li>
        <li>Every correct answer gives 1 mark; no negative marking.</li>
        <li>Your score will be instantly converted to an estimated band.</li>
      </ul>
    </div>
  </TestIntroLayout>
</template>

<style scoped lang="scss">
.reading-intro-view {
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
