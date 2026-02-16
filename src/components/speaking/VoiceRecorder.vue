<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { RecordingState } from '@/types/speaking'

interface Props {
  recordingState: RecordingState
}

const props = defineProps<Props>()
const emit = defineEmits<{
  start: []
  pause: []
  stop: []
  delete: []
  recorded: [blob: Blob]
}>()

// Internal recording state
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const recordingSeconds = ref(0)
const recordingInterval = ref<number | null>(null)

const formattedTime = computed(() => {
  const h = Math.floor(recordingSeconds.value / 3600)
  const m = Math.floor((recordingSeconds.value % 3600) / 60)
  const s = recordingSeconds.value % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
})

const hasRecording = computed(() => props.recordingState !== 'idle' || recordingSeconds.value > 0)

const startRecordingTimer = () => {
  recordingInterval.value = window.setInterval(() => {
    recordingSeconds.value++
  }, 1000)
}

const stopRecordingTimer = () => {
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value)
    recordingInterval.value = null
  }
}

const handleMicButton = async () => {
  if (props.recordingState === 'idle') {
    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunks.value = []
      mediaRecorder.value = new MediaRecorder(stream)

      mediaRecorder.value.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.value.push(e.data)
      }

      mediaRecorder.value.onstop = () => {
        const blob = new Blob(audioChunks.value, { type: 'audio/webm' })
        emit('recorded', blob)
        // Stop all tracks to release mic
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.value.start()
      startRecordingTimer()
      emit('start')
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  } else if (props.recordingState === 'recording') {
    // Pause
    mediaRecorder.value?.pause()
    stopRecordingTimer()
    emit('pause')
  } else if (props.recordingState === 'paused') {
    // Resume
    mediaRecorder.value?.resume()
    startRecordingTimer()
    emit('start')
  }
}

const handleStop = () => {
  mediaRecorder.value?.stop()
  stopRecordingTimer()
  emit('stop')
}

const handleDelete = () => {
  if (mediaRecorder.value && props.recordingState !== 'idle') {
    mediaRecorder.value.stop()
  }
  stopRecordingTimer()
  recordingSeconds.value = 0
  audioChunks.value = []
  emit('delete')
}

onUnmounted(() => {
  stopRecordingTimer()
  if (mediaRecorder.value && props.recordingState !== 'idle') {
    mediaRecorder.value.stop()
  }
})
</script>

<template>
  <div class="voice-recorder">
    <!-- Wave animation + mic button -->
    <div class="voice-recorder__mic-wrapper">
      <div
        v-if="props.recordingState === 'recording'"
        class="voice-recorder__wave voice-recorder__wave--1"
      />
      <div
        v-if="props.recordingState === 'recording'"
        class="voice-recorder__wave voice-recorder__wave--2"
      />
      <div
        v-if="props.recordingState === 'recording'"
        class="voice-recorder__wave voice-recorder__wave--3"
      />
      <button
        class="voice-recorder__mic-button"
        :class="{
          'voice-recorder__mic-button--recording': props.recordingState === 'recording',
          'voice-recorder__mic-button--paused': props.recordingState === 'paused',
        }"
        @click="handleMicButton"
      >
        <Icon
          v-if="props.recordingState !== 'recording'"
          name="mic"
          size="32px"
          :color="props.recordingState === 'paused' ? '#ffffff' : 'var(--color-primary)'"
        />
        <Icon v-else name="pause" size="32px" color="#ffffff" />
      </button>
    </div>

    <!-- Duration display -->
    <p class="voice-recorder__duration">{{ formattedTime }}</p>

    <!-- Controls row -->
    <div class="voice-recorder__controls">
      <button
        class="voice-recorder__control-button voice-recorder__control-button--delete"
        :disabled="props.recordingState === 'idle' && recordingSeconds === 0"
        @click="handleDelete"
      >
        <Icon name="trash" size="24px" color="#ff4d4f" />
      </button>

      <button
        class="voice-recorder__control-button voice-recorder__control-button--stop"
        :disabled="props.recordingState === 'idle'"
        @click="handleStop"
      >
        <Icon name="stop" size="24px" color="#171717" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.voice-recorder {
  background-color: var(--color-background-white);
  border-radius: 24px;
  padding: 32px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  &__mic-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
  }

  &__wave {
    position: absolute;
    border-radius: 50%;
    border: 2px solid var(--color-primary);
    opacity: 0;
    animation: pulse-wave 1.8s ease-out infinite;

    &--1 {
      width: 90px;
      height: 90px;
      animation-delay: 0s;
    }

    &--2 {
      width: 110px;
      height: 110px;
      animation-delay: 0.4s;
    }

    &--3 {
      width: 130px;
      height: 130px;
      animation-delay: 0.8s;
    }
  }

  &__mic-button {
    position: relative;
    z-index: 1;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 2px solid var(--color-primary);
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &--recording {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }

    &--paused {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      opacity: 0.7;
    }
  }

  &__duration {
    font-size: 22px;
    font-weight: 600;
    color: #171717;
    letter-spacing: 0.05em;
    margin: 0;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  &__control-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1.5px solid #e0e0e0;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &:not(:disabled):active {
      transform: scale(0.95);
    }
  }
}

@keyframes pulse-wave {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>
