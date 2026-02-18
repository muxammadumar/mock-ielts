<script setup lang="ts">
import { useRouter } from 'vue-router'
import TestIntroLayout from '@/components/common/TestIntroLayout.vue'
import { useWritingStore } from '@/stores/useWritingStore'
import { useAttemptStore } from '@/stores/useAttemptStore'

const router = useRouter()
const writingStore = useWritingStore()
const attemptStore = useAttemptStore()

const startTest = () => {
  if (!attemptStore.attemptId) {
    writingStore.resetTest()
  }
  router.push({ name: 'writing-test' })
}
</script>

<template>
  <TestIntroLayout title="Writing test" buttonText="Start writing test" @back="router.back()" @start="startTest">
    <div class="writing-intro-view__info-card">
      <h1 class="writing-intro-view__card-title">IELTS Writing Test</h1>
      <p class="writing-intro-view__card-subtitle">Develop your formal writing skills</p>
      <div class="writing-intro-view__info-item">
        <Icon name="book-gray" size="40px" />
        <div class="writing-intro-view__info-content">
          <p class="writing-intro-view__info-value">Task 1 & Task 2</p>
          <p class="writing-intro-view__info-label">FORMAL WRITING TASKS</p>
        </div>
      </div>
      <div class="writing-intro-view__info-item">
        <Icon name="time-gray" size="40px" />
        <div class="writing-intro-view__info-content">
          <p class="writing-intro-view__info-value">60 mins</p>
          <p class="writing-intro-view__info-label">TOTAL DURATION</p>
        </div>
      </div>
    </div>

    <div class="writing-intro-view__rules-card">
      <h3 class="writing-intro-view__rules-title">Before you start</h3>
      <ul class="writing-intro-view__rules-list">
        <li>Task 1 requires at least 150 words; Task 2 requires at least 250 words.</li>
        <li>You should spend about 20 minutes on Task 1 and 40 minutes on Task 2.</li>
        <li>Task 2 carries more marks than Task 1, so manage your time wisely.</li>
        <li>Write in a formal academic style; avoid informal language or contractions.</li>
        <li>Your response will be assessed on task achievement, coherence, vocabulary, and grammar.</li>
      </ul>
    </div>
  </TestIntroLayout>
</template>

<style scoped lang="scss">
.writing-intro-view {
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
