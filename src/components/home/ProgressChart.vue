<template>
  <div class="progress-chart">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem,
} from 'chart.js'
import type { ProgressDataPoint } from '@/types/dashboard'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
  data: ProgressDataPoint[]
  currentDate: string
}

const props = defineProps<Props>()

const chartData = computed(() => {
  const labels = props.data.map((point) => point.date)
  const scores = props.data.map((point) => point.score)
  const currentIndex = labels.findIndex((label) => label === props.currentDate)

  return {
    labels,
    datasets: [
      {
        label: 'Score',
        data: scores,
        borderColor: '#a175f0',
        backgroundColor: 'rgba(161, 117, 240, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: (context: { dataIndex: number }) => {
          return context.dataIndex === currentIndex ? 6 : 4
        },
        pointBackgroundColor: (context: { dataIndex: number }) => {
          return context.dataIndex === currentIndex ? '#a175f0' : '#a175f0'
        },
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 8,
      titleFont: {
        size: 12,
        weight: 500,
      },
      bodyFont: {
        size: 14,
        weight: 600,
      },
      displayColors: false,
      callbacks: {
        label: (tooltipItem: TooltipItem<'line'>) => {
          const value = tooltipItem.parsed.y
          if (value === null || value === undefined) return ''
          return `Score: ${value.toFixed(1)}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        drawBorder: false,
        borderDash: [4, 4],
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 11,
        },
        color: 'var(--color-text-secondary)',
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
  elements: {
    point: {
      hoverRadius: 8,
    },
  },
}
</script>

<style scoped lang="scss">
.progress-chart {
  width: 100%;
  height: 200px;
  margin-top: var(--spacing-sm);
  position: relative;
}
</style>
