import { createRouter, createWebHistory } from 'vue-router'
import type { Router, RouteLocationNormalized } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import { useAuthStore } from '@/stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: () => import('@/layout/onboarding.vue'),
      meta: { requiresAuth: false },
      children: [
        {
          path: '',
          name: 'onboarding-view',
          component: () => import('@/views/OnboardingView.vue'),
        },
      ],
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/layout/auth.vue'),
      meta: { requiresAuth: false },
      children: [
        {
          path: 'signin',
          name: 'signin',
          component: () => import('@/views/auth/SignInView.vue'),
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/auth/SignUpView.vue'),
        },
        {
          path: 'otp',
          name: 'otp',
          component: () => import('@/views/auth/OtpView.vue'),
        },
      ],
    },
    {
      path: '/',
      name: 'main',
      component: () => import('@/layout/main.vue'),
      meta: { requiresAuth: false },
      // meta: { requiresAuth: true },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'mock-test',
          name: 'mock-test',
          component: () => import('@/views/MockTestView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue'),
        },
        {
          path: 'listening-intro',
          name: 'listening-intro',
          component: () => import('@/views/ListeningIntroView.vue'),
        },
        {
          path: 'listening-test',
          name: 'listening-test',
          component: () => import('@/views/ListeningTestView.vue'),
        },
        {
          path: 'listening-results',
          name: 'listening-results',
          component: () => import('@/views/ListeningResultsView.vue'),
        },
        {
          path: 'reading-intro',
          name: 'reading-intro',
          component: () => import('@/views/ReadingIntroView.vue'),
        },
        {
          path: 'reading-test',
          name: 'reading-test',
          component: () => import('@/views/ReadingTestView.vue'),
        },
        {
          path: 'writing-intro',
          name: 'writing-intro',
          component: () => import('@/views/WritingIntroView.vue'),
        },
        {
          path: 'writing-test',
          name: 'writing-test',
          component: () => import('@/views/WritingTestView.vue'),
        },
        {
          path: 'speaking-intro',
          name: 'speaking-intro',
          component: () => import('@/views/SpeakingIntroView.vue'),
        },
        {
          path: 'speaking-test',
          name: 'speaking-test',
          component: () => import('@/views/SpeakingTestView.vue'),
        },
        {
          path: 'mock-test-result',
          name: 'mock-test-result',
          component: () => import('@/views/MockTestResultView.vue'),
        },
        {
          path: 'answers-review',
          name: 'answers-review',
          component: () => import('@/views/AnswersReviewView.vue'),
        },
      ],
    },
  ],
})

export const setupLoadingGuards = (routerInstance: Router) => {
  routerInstance.beforeEach(() => {
    const appStore = useAppStore()
    appStore.show()
  })

  routerInstance.afterEach(() => {
    const appStore = useAppStore()
    setTimeout(() => {
      appStore.hide()
    }, 300)
  })
}

export const setupAuthGuards = (routerInstance: Router) => {
  routerInstance.beforeEach((to: RouteLocationNormalized) => {
    const authStore = useAuthStore()

    // Check auth status from localStorage
    authStore.checkAuth()

    const requiresAuth = to.meta.requiresAuth === true
    const isAuthenticated = authStore.isAuthenticated

    // If route requires auth and user is not authenticated, redirect to sign in
    if (requiresAuth && !isAuthenticated) {
      return { name: 'signin', query: { redirect: to.fullPath } }
    }

    // If user is authenticated and trying to access auth routes or onboarding, redirect to home
    if (isAuthenticated && (
      to.matched.some(record => record.path.startsWith('/auth')) ||
      to.name === 'onboarding-view'
    )) {
      return { name: 'home' }
    }
  })
}

export default router
