import { ref } from 'vue'
import type { DashboardData } from '@/types/dashboard'

const mockDashboardData: DashboardData = {
  progressData: [
    { date: '12 MAY', score: 6.5, fullDate: '2024-05-12' },
    { date: '13 MAY', score: 6.8, fullDate: '2024-05-13' },
    { date: '14 MAY', score: 7.0, fullDate: '2024-05-14' },
    { date: '15 MAY', score: 6.9, fullDate: '2024-05-15' },
    { date: '16 MAY', score: 7.0, fullDate: '2024-05-16' },
    { date: '17 MAY', score: 7.1, fullDate: '2024-05-17' },
  ],
  skillScores: [
    {
      name: 'LISTENING',
      score: 7.0,
      icon: 'headphones',
      color: 'var(--color-accent-blue)',
    },
    {
      name: 'READING',
      score: 7.0,
      icon: 'book',
      color: 'var(--color-accent-orange)',
    },
    {
      name: 'WRITING',
      score: 7.0,
      icon: 'pencil',
      color: 'var(--color-accent-green)',
    },
    {
      name: 'SPEAKING',
      score: 6.5,
      icon: 'speech-bubble',
      color: 'var(--color-accent-pink)',
    },
  ],
  currentScore: 7.0,
  currentDate: '16 MAY',
  scoreBand: 7,
  points: 10,
}

export const useDashboardData = () => {
  const isLoading = ref(false)
  const dashboardData = ref<DashboardData>(mockDashboardData)

  const fetchDashboardData = async () => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      // In real implementation, replace with actual API call
      // const response = await dashboardService.getDashboardData()
      // dashboardData.value = response
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    dashboardData,
    isLoading,
    fetchDashboardData,
  }
}
