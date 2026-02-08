<template>
  <div class="otp-view">
    <div class="header">
      <button class="back-button" @click="handleBack">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <div class="content">
      <h1 class="title">{{ $t('auth.otp.title') }}</h1>
      <p class="description">
        {{ $t('auth.otp.description', { phone: formattedPhone }) }}
      </p>

      <div class="otp-container">
        <CustomOtpInput
          ref="otpInputRef"
          v-model="otpCode"
          :error="hasError"
          :disabled="isLoading"
          @complete="handleOtpComplete"
        />
        <p v-if="hasError" class="error-message">
          {{ $t('auth.otp.incorrectCode') }}
        </p>
      </div>

      <div class="resend-container">
        <button
          v-if="canResend"
          class="resend-button"
          :disabled="isLoading"
          @click="handleResend"
        >
          {{ $t('auth.otp.resend') }}
        </button>
        <span v-else class="resend-timer">
          {{ $t('auth.otp.sendCodeAgain') }} {{ formattedTimer }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import CustomOtpInput from '@/components/auth/CustomOtpInput.vue'
import type { ComponentPublicInstance } from 'vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const phone = computed(() => (route.query.phone as string) || '')
const code = computed(() => (route.query.code as string) || '')

const formattedPhone = computed(() => {
  // Format phone number for display (e.g., +998 99 999 99 99)
  const cleaned = phone.value.replace(/\D/g, '')
  if (cleaned.length >= 9) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)}`
  }
  return phone.value
})

const otpCode = ref('')
const hasError = ref(false)
const isLoading = ref(false)
const canResend = ref(false)
const timer = ref(20) // 20 seconds countdown
const timerInterval = ref<number | null>(null)

const otpInputRef = ref<ComponentPublicInstance<InstanceType<typeof CustomOtpInput>> | null>(null)

const formattedTimer = computed(() => {
  const minutes = Math.floor(timer.value / 60)
  const seconds = timer.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const startTimer = () => {
  canResend.value = false
  timer.value = 20

  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }

  timerInterval.value = window.setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      canResend.value = true
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
      }
    }
  }, 1000)
}

const handleOtpComplete = async (otp: string) => {
  if (!code.value) {
    router.push('/auth/signin')
    return
  }

  isLoading.value = true
  hasError.value = false

  try {
    await authStore.verifyOtp({
      code: code.value,
      otp,
    })

    // Navigate to home on success
    router.push('/home')
  } catch (error) {
    hasError.value = true
    otpCode.value = ''
    otpInputRef.value?.clear()
  } finally {
    isLoading.value = false
  }
}

const handleResend = async () => {
  if (!code.value) {
    router.push('/auth/signin')
    return
  }

  isLoading.value = true
  hasError.value = false
  otpCode.value = ''
  otpInputRef.value?.clear()

  try {
    await authStore.resendOtp({
      code: code.value,
    })
    startTimer()
  } catch (error) {
    // Error is handled in the service
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  if (!phone.value || !code.value) {
    router.push('/auth/signin')
    return
  }

  startTimer()
  otpInputRef.value?.focus()
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script>

<style scoped lang="scss">
.otp-view {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding-top: calc(env(safe-area-inset-top, 0px) + 20px);
  padding-bottom: calc(env(safe-area-inset-bottom, 0px));
}

.header {
  padding: 0 20px 20px;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f7f8fa;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #969799;
  transition: background-color 0.2s ease;

  &:active {
    background-color: #ebedf0;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.content {
  flex: 1;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #323233;
  margin-bottom: 12px;
  line-height: 1.2;
}

.description {
  font-size: 16px;
  color: #969799;
  margin-bottom: 40px;
  line-height: 1.5;
}

.otp-container {
  margin-bottom: 32px;
}

.error-message {
  text-align: center;
  color: #ee0a24;
  font-size: 14px;
  margin-top: 16px;
}

.resend-container {
  text-align: center;
  margin-top: auto;
  margin-bottom: 20px;
}

.resend-button {
  color: #a175f0;
  font-size: 16px;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.resend-timer {
  color: #323233;
  font-size: 16px;
}
</style>
