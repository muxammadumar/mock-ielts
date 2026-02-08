<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { showToast } from 'vant'
import { formatTime } from '@/utils/formatTime'
import type { AudioControlMode } from '@/types/listening'

interface Props {
  audioUrl: string
  controlMode?: AudioControlMode
}

const props = withDefaults(defineProps<Props>(), {
  controlMode: 'practice',
})

const emit = defineEmits<{
  play: []
  pause: []
  timeUpdate: [time: number]
  ended: []
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isLoading = ref(true)

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// Control restrictions based on mode
const canSeek = computed(() => props.controlMode === 'practice')
const canPause = computed(() => props.controlMode === 'practice')

const togglePlayPause = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    if (!canPause.value) {
      showToast({ message: 'Pausing is disabled in exam mode', type: 'fail' })
      return
    }
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

const handlePlay = () => {
  isPlaying.value = true
  emit('play')
}

const handlePause = () => {
  isPlaying.value = false
  emit('pause')
}

const handleTimeUpdate = () => {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime
  emit('timeUpdate', currentTime.value)
}

const handleLoadedMetadata = () => {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration
  isLoading.value = false
}

const handleEnded = () => {
  isPlaying.value = false
  emit('ended')
}

const handleSeek = (value: number) => {
  if (!canSeek.value) {
    showToast({ message: 'Seeking is disabled in exam mode', type: 'fail' })
    return
  }
  if (!audioRef.value) return
  const newTime = (value / 100) * duration.value
  audioRef.value.currentTime = newTime
  currentTime.value = newTime
}

// Cleanup
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<template>
  <div class="audio-player">
    <audio
      ref="audioRef"
      :src="audioUrl"
      @play="handlePlay"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
    />

    <div class="audio-player__waveform">
      <!-- Waveform visualization placeholder -->
      <div class="audio-player__waveform-bars">
        <div
          v-for="i in 50"
          :key="i"
          class="audio-player__waveform-bar"
          :class="{ 'audio-player__waveform-bar--active': i <= progress / 2 }"
          :style="{ height: `${Math.random() * 60 + 40}%` }"
        />
      </div>
    </div>

    <div class="audio-player__controls">
      <button
        class="audio-player__play-button"
        @click="togglePlayPause"
        :disabled="isLoading"
      >
        <Icon
          v-if="!isPlaying"
          name="play-icon"
          size="24px"
          color="white"
        />
        <Icon
          v-else
          name="pause-icon"
          size="24px"
          color="white"
        />
      </button>

      <div class="audio-player__progress">
        <van-slider
          v-model="progress"
          :min="0"
          :max="100"
          :step="0.1"
          :disabled="!canSeek"
          @update:model-value="handleSeek"
          bar-height="4px"
          active-color="#A175F0"
          inactive-color="#e0e0e0"
        />
      </div>

      <div class="audio-player__time">
        {{ formattedCurrentTime }}/{{ formattedDuration }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.audio-player {
  background-color: var(--color-background-white);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  &__waveform {
    width: 100%;
    height: 60px;
    background: linear-gradient(to right, #f5f5f5, #e8e8e8);
    border-radius: 12px;
    margin-bottom: 16px;
    overflow: hidden;
    position: relative;
  }

  &__waveform-bars {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 4px;
    gap: 2px;
  }

  &__waveform-bar {
    flex: 1;
    background-color: #d0d0d0;
    border-radius: 2px;
    transition: all 0.2s ease;

    &--active {
      background-color: var(--color-primary);
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__play-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--color-primary);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(161, 117, 240, 0.3);
    }

    &:active {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__progress {
    flex: 1;
    padding: 0 8px;
  }

  &__time {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
    white-space: nowrap;
    min-width: 85px;
    text-align: right;
  }
}
</style>
