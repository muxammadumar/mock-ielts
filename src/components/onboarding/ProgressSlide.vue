<template>
  <div class="progress-slide">
    <h1 class="slide-title">{{ $t('onboarding.slide2.title') }}</h1>
    <p class="slide-description">{{ $t('onboarding.slide2.description') }}</p>
    <div class="slide-image-container">
      <img
        src="@/assets/images/onboarding-three.png"
        alt="Progress chart"
        class="slide-image"
        :class="{ 'animate-in': isActive }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isActive?: boolean
}

withDefaults(defineProps<Props>(), {
  isActive: false,
})
</script>

<style scoped lang="scss">
.progress-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: fit-content;
  padding: 20px;
  padding-top: 60px;
  padding-bottom: 40px;
  text-align: center;
}

.slide-title {
  color: #ffffff;
  margin-bottom: 16px;
}

.slide-description {
  color: #ffffff;
  margin-bottom: 40px;
}

.slide-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide-image {
  max-width: 100%;
  height: auto;
  opacity: 0;
  transform: translateY(100px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
