<template>
  <div class="sign-up-view">
    <div class="header">
      <div class="logo">
        <Icon name="auth-logo" />
      </div>
      <router-link to="/auth/signin" class="sign-in-link">
        {{ $t('auth.signUp.signInLink') }}
      </router-link>
    </div>

    <div class="content">
      <h1 class="title">{{ $t('auth.signUp.title') }}</h1>
      <p class="description">{{ $t('auth.signUp.description') }}</p>

      <div class="form">
        <div class="input-wrapper">
          <input
            v-model="form.firstName"
            type="text"
            :placeholder="$t('auth.signUp.firstNamePlaceholder')"
            class="input-field"
            :class="{ error: errors.firstName }"
          />
        </div>

        <div class="input-wrapper">
          <input
            v-model="form.lastName"
            type="text"
            :placeholder="$t('auth.signUp.lastNamePlaceholder')"
            class="input-field"
            :class="{ error: errors.lastName }"
          />
        </div>

        <div class="input-wrapper">
          <input
            :value="formattedPhone"
            type="tel"
            :placeholder="$t('auth.signUp.phonePlaceholder')"
            class="input-field"
            :class="{ error: errors.phone }"
            @input="handlePhoneInput"
          />
        </div>

        <div class="input-wrapper">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('auth.signUp.passwordPlaceholder')"
            class="input-field"
            :class="{ error: errors.password }"
          />
          <button type="button" class="password-toggle" @click="showPassword = !showPassword">
            <svg
              v-if="showPassword"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17C15 17 18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z"
                fill="#969799"
              />
            </svg>
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2L18 18M8.88 8.88C8.3 9.46 8 10.2 8 11C8 12.66 9.34 14 11 14C11.8 14 12.54 13.7 13.12 13.12M6.61 6.61C4.24 7.82 2.73 9.11 2 10C2.73 12.89 6 17 11 17C12.68 17 14.2 16.5 15.39 15.61M12.12 12.12C11.54 12.7 10.8 13 10 13C8.34 13 7 11.66 7 10C7 9.2 7.3 8.46 7.88 7.88M12.12 12.12L7.88 7.88M12.12 12.12L15.39 15.61M7.88 7.88L6.61 6.61"
                stroke="#969799"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button class="submit-button" :disabled="isLoading" @click="handleSubmit">
          {{ $t('auth.signUp.button') }}
        </button>

        <div class="separator">
          <span>{{ $t('auth.signUp.or') }}</span>
        </div>

        <div class="social-login">
          <button class="social-button social-apple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
              />
            </svg>
          </button>
          <button class="social-button social-facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </button>
          <button class="social-button social-google">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { formatUzbekPhone, cleanPhoneNumber } from '@/utils'
import { showToast } from 'vant'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  password: '',
})

const errors = ref({
  firstName: false,
  lastName: false,
  phone: false,
  password: false,
})

const showPassword = ref(false)
const isLoading = ref(false)

const formattedPhone = computed(() => formatUzbekPhone(form.value.phone))

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const cleaned = cleanPhoneNumber(target.value)
  form.value.phone = cleaned
  // Update input value to show formatted version
  const formatted = formatUzbekPhone(cleaned)
  // Use nextTick to ensure the value updates correctly
  nextTick(() => {
    if (target.value !== formatted) {
      target.value = formatted
    }
  })
}

const validateForm = (): boolean => {
  errors.value.firstName = !form.value.firstName.trim()
  errors.value.lastName = !form.value.lastName.trim()

  const phoneNumber = form.value.phone.startsWith('998')
    ? form.value.phone
    : '998' + form.value.phone
  // Uzbek phone: 998 + 9 digits = 12 digits total
  errors.value.phone = !form.value.phone.trim() || phoneNumber.length !== 12

  errors.value.password = !form.value.password || form.value.password.length < 8

  return (
    !errors.value.firstName &&
    !errors.value.lastName &&
    !errors.value.phone &&
    !errors.value.password
  )
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showToast({
      message: 'Please fill all fields correctly',
      type: 'fail',
    })
    return
  }

  isLoading.value = true

  try {
    // Ensure phone starts with 998
    const phoneNumber = form.value.phone.startsWith('998')
      ? form.value.phone
      : '998' + form.value.phone

    await authStore.signUp({
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      phone: phoneNumber,
      password: form.value.password,
    })

    // Navigate to OTP screen
    router.push({
      path: '/auth/otp',
      query: { phone: phoneNumber },
    })
  } catch (error) {
    // Error is handled in the service
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.sign-up-view {
  min-height: 100dvh;
  padding-top: calc(env(safe-area-inset-top, 0px) + 20px);
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 20px);
  padding-left: 20px;
  padding-right: 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 600;
}

.sign-in-link {
  color: #a175f0;
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
  text-decoration: none;
}

.content {
  max-width: 100%;
  height: max-content;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  line-height: 24px;
  font-weight: bold;
  color: #161619;
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  line-height: 24px;
  font-weight: medium;
  color: #5c5c5c;
  margin-bottom: 24px;
}

.form {
  margin-bottom: auto;
}

.form-actions {
  margin-top: auto;
}

.input-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.input-field {
  width: 100%;
  height: 56px;
  padding: 0 16px;
  border: 1px solid #ebedf0;
  border-radius: 12px;
  background-color: #f5f5f5;
  font-size: 16px;
  color: #323233;
  transition: all 0.2s ease;

  &::placeholder {
    color: #969799;
  }

  &:focus {
    outline: none;
    border-color: #a175f0;
    background-color: #ffffff;
  }

  &.error {
    border-color: #ee0a24;
  }
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button {
  width: 100%;
  height: 56px;
  background-color: #a175f0;
  color: #ffffff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.separator {
  text-align: center;
  margin: 32px 0;
  color: #969799;
  font-size: 14px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.social-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid #ebedf0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  background-color: #ffffff;

  &:active {
    transform: scale(0.95);
  }
}

.social-apple {
  background-color: #000000;
  border-color: #000000;
  color: #ffffff;
}

.social-facebook {
  background-color: #1877f2;
  border-color: #1877f2;
  color: #ffffff;
}

.social-google {
  background-color: #ffffff;
  border-color: #ebedf0;
}
</style>
