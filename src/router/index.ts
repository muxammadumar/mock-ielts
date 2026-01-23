import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: () => import('@/layout/onboarding.vue'),
      children: [
        {
          path: '',
          name: 'onboarding-view',
          component: () => import('@/views/OnboardingView.vue'),
        },
      ],
    },
    {
      path: '/home',
      name: 'main',
      component: () => import('@/layout/main.vue'),
      children: [
        {
          path: '',
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

export default router
