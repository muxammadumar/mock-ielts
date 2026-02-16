<script setup lang="ts">
import { useRouter } from 'vue-router'
import UserHeader from '@/components/common/UserHeader.vue'
import { useWritingStore } from '@/stores/useWritingStore'

const router = useRouter()
const writingStore = useWritingStore()

const points = 100

const startTest = () => {
  writingStore.resetTest()
  router.push({ name: 'writing-test' })
}
</script>

<template>
  <div class="writing-intro-view">
    <UserHeader :points="points" />
    <div class="writing-intro-view__content">
      <h1 class="writing-intro-view__title">IELTS Writing Test</h1>
      <p class="writing-intro-view__subtitle">Develop your formal writing skills</p>

      <div class="writing-intro-view__info-card">
        <div class="writing-intro-view__info-item">
          <Icon name="book-gray" size="40px" />
          <div class="writing-intro-view__info-content">
            <p class="writing-intro-view__info-value">Task 1 & Task 2</p>
            <p class="writing-intro-view__info-title">FORMAL WRITING TASKS</p>
          </div>
        </div>
        <div class="writing-intro-view__info-item">
          <Icon name="time-gray" size="40px" />
          <div class="writing-intro-view__info-content">
            <p class="writing-intro-view__info-value">60 mins</p>
            <p class="writing-intro-view__info-title">TOTAL DURATION</p>
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

      <van-button
        type="primary"
        block
        size="large"
        class="writing-intro-view__start-button"
        @click="startTest"
      >
        Start writing test
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.writing-intro-view {
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
