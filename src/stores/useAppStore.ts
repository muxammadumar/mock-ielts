import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Locale, Theme } from '@/types'
import i18n from '@/locales'

export const useAppStore = defineStore('app', () => {
  const isLoading = ref<boolean>(false)
  const loadingText = ref<string | undefined>(undefined)

  const show = (text?: string) => {
    isLoading.value = true
    loadingText.value = text
  }

  const hide = () => {
    isLoading.value = false
    loadingText.value = undefined
  }

  const currentLocale = ref<Locale>(i18n.global.locale.value as Locale)

  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
    i18n.global.locale.value = locale
    localStorage.setItem('locale', locale)
  }

  const initLocale = () => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && ['en', 'uz', 'ru'].includes(saved)) {
      setLocale(saved)
    }
  }

  const currentTheme = ref<Theme>('light')

  return {
    isLoading,
    loadingText,
    show,
    hide,
    currentLocale,
    setLocale,
    initLocale,
    currentTheme,
  }
})
