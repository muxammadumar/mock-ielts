import { createI18n } from 'vue-i18n'
import type { Locale } from '@/types'

import enCommon from './en/common.json'
import enNavbar from './en/navbar.json'
import enPages from './en/pages.json'
import enOnboarding from './en/onboarding.json'
import enAuth from './en/auth.json'

import uzCommon from './uz/common.json'
import uzNavbar from './uz/navbar.json'
import uzPages from './uz/pages.json'
import uzOnboarding from './uz/onboarding.json'
import uzAuth from './uz/auth.json'

import ruCommon from './ru/common.json'
import ruNavbar from './ru/navbar.json'
import ruPages from './ru/pages.json'
import ruOnboarding from './ru/onboarding.json'
import ruAuth from './ru/auth.json'

const messages = {
  en: {
    common: enCommon,
    navbar: enNavbar,
    pages: enPages,
    onboarding: enOnboarding,
    auth: enAuth,
  },
  uz: {
    common: uzCommon,
    navbar: uzNavbar,
    pages: uzPages,
    onboarding: uzOnboarding,
    auth: uzAuth,
  },
  ru: {
    common: ruCommon,
    navbar: ruNavbar,
    pages: ruPages,
    onboarding: ruOnboarding,
    auth: ruAuth,
  },
}

const getDefaultLocale = (): Locale => {
  const saved = localStorage.getItem('locale') as Locale | null
  if (saved && ['en', 'uz', 'ru'].includes(saved)) {
    return saved
  }
  return 'uz'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'uz',
  messages,
})

export default i18n
