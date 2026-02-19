import { ref } from 'vue'
import type { DashboardData } from '@/types/dashboard'

export const useDashboardData = () => {
  const isLoading = ref(false)
  const dashboardData = ref<DashboardData | null>(null)

  const fetchDashboardData = async () => {
    isLoading.value = true
    try {
      // TODO: replace with actual API call
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
