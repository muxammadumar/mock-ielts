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
      @click="handleSlideClick"
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
      <button class="continue-button" @click.stop="handleContinue">
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

const goToNext = () => {
  if (currentSlide.value < 2) {
    currentSlide.value++
    swipeRef.value?.swipeTo(currentSlide.value)
  } else {
    router.push('/home')
  }
}

const goToPrevious = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
    swipeRef.value?.swipeTo(currentSlide.value)
  }
}

const handleSlideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const container = e.currentTarget as HTMLElement
  
  // Don't handle clicks on interactive elements
  if (target.closest('.continue-button-container') || target.closest('button')) {
    return
  }
  
  const containerWidth = container.clientWidth
  const clickX = e.clientX - container.getBoundingClientRect().left
  const clickPercentage = (clickX / containerWidth) * 100
  
  if (clickPercentage > 50) {
    // Right side clicked - go to next
    goToNext()
  } else {
    // Left side clicked - go to previous
    goToPrevious()
  }
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
  height: 100dvh;
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
  padding-top: calc(15px + env(safe-area-inset-top, 0px));
  justify-content: center;
  position: absolute;
  top: 0;
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
  width: 100%;
  padding-top: 60px;
  padding-bottom: 120px;
  height: calc(100dvh - 120px);
  overflow-y: hidden;
  overflow-x: hidden;
}

.continue-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background: linear-gradient(180deg, transparent 0%, #a175f0 20%);
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
