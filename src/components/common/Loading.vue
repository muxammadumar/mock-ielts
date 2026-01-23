<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="appStore.isLoading" class="loading-overlay">
        <div class="loading-content">
          <slot>
            <div class="loading-animation-container">
              <img src="@/assets/images/loading-logo.svg" alt="loading-logo">
              <div class="loading-animation">
                <img class="star star-left" src="@/assets/images/loading-star.svg" alt="loading-star">
                <img class="pen" src="@/assets/images/loading-pen.svg" alt="loading-pen">
                <img class="star star-right" src="@/assets/images/loading-star.svg" alt="loading-star">
              </div>
            </div>
          </slot>
          <p v-if="appStore.loadingText" class="loading-text">
            {{ appStore.loadingText }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/useAppStore'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.loading-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: linear-gradient(180deg, #A175F0 0%, #BE9EF8 100%);

}


.loading-text {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #ffffff;
  text-align: center;
}

.loading-animation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 6px;
}

.loading-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 20px;
}

.star {
  position: absolute;
  animation: floatStar 2s ease-in-out infinite;
}

.star-left {
  bottom: 0px;
  left: 0px;
  animation-delay: 0s;
}

.star-right {
  top: 0px;
  right: 0px;
  animation-delay: 1s;
}

.pen {
  position: relative;
  animation: writePen 1.5s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes floatStar {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-15px) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes writePen {
  0%,
  100% {
    transform: rotate(-5deg) translateY(0);
  }
  25% {
    transform: rotate(5deg) translateY(-3px);
  }
  50% {
    transform: rotate(-3deg) translateY(-5px);
  }
  75% {
    transform: rotate(3deg) translateY(-2px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
