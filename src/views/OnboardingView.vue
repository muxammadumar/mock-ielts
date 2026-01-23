<template>
  <div class="onboarding-view">
    <div class="progress-indicators">
      <div
        v-for="(_, index) in 3"
        :key="index"
        :class="['indicator', { active: currentSlide === index }]"
      />
    </div>

    <van-swipe
      ref="swipeRef"
      v-model:current="currentSlide"
      :show-indicators="false"
      class="onboarding-swipe"
      @change="handleSlideChange"
    >
      <van-swipe-item>
        <WelcomeSlide :is-active="currentSlide === 0" />
      </van-swipe-item>
      <van-swipe-item>
        <EvaluationSlide :is-active="currentSlide === 1" />
      </van-swipe-item>
      <van-swipe-item>
        <ProgressSlide :is-active="currentSlide === 2" />
      </van-swipe-item>
    </van-swipe>

    <div class="continue-button-container">
      <button class="continue-button" @click="handleContinue">
        {{ $t(`onboarding.slide${currentSlide + 1}.button`) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WelcomeSlide from '@/components/onboarding/WelcomeSlide.vue'
import ProgressSlide from '@/components/onboarding/ProgressSlide.vue'
import EvaluationSlide from '@/components/onboarding/EvaluationSlide.vue'

const router = useRouter()
const currentSlide = ref(0)
const swipeRef = ref()

const handleSlideChange = (index: number) => {
  currentSlide.value = index
}

const handleContinue = () => {
  if (currentSlide.value < 2) {
    currentSlide.value++
    swipeRef.value?.swipeTo(currentSlide.value)
  } else {
    router.push('/home')
  }
}
</script>

<style scoped lang="scss">
.onboarding-view {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #a175f0 0%, #be9ef8 100%);
  position: relative;
  overflow: hidden;
}

.progress-indicators {
  display: flex;
  gap: 8px;
  padding: 15px;
  justify-content: center;
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  z-index: 10;
}

.indicator {
  height: 4px;
  width: calc(100% / 3);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  transition: all 0.3s ease;

  &.active {
    background-color: #ffffff;
  }
}

.onboarding-swipe {
  flex: 1;
  width: 100%;
}

.continue-button-container {
  padding: 20px;
  padding-bottom: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.continue-button {
  width: 80%;
  padding: 16px;
  background-color: #ffffff;
  color: #a175f0;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }
}
</style>
