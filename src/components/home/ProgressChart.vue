<template>
  <svg viewBox="0 0 360 180" width="100%" height="auto" class="progress-chart">
    <!-- Dashed vertical grid lines -->
    <line
      v-for="(point, i) in points"
      :key="`grid-${i}`"
      :x1="point.x"
      :y1="PADDING.top"
      :x2="point.x"
      :y2="180 - PADDING.bottom"
      :stroke="i === activeIndex ? '#d4baff' : '#eeeeee'"
      stroke-dasharray="3 4"
      stroke-width="1"
    />

    <!-- Connecting line through all points -->
    <polyline
      :points="polylinePoints"
      stroke="#a175f0"
      stroke-width="2"
      fill="none"
    />

    <!-- Inactive data points -->
    <template v-for="(point, i) in points" :key="`point-${i}`">
      <circle
        v-if="i !== activeIndex"
        :cx="point.x"
        :cy="point.y"
        r="4.5"
        fill="rgba(161,117,240,0.25)"
        stroke="#a175f0"
        stroke-width="1.5"
      />
    </template>

    <!-- Active data point (glow ring + filled circle) -->
    <template v-if="activeIndex >= 0 && activeIndex < points.length">
      <circle
        :cx="points[activeIndex].x"
        :cy="points[activeIndex].y"
        r="13"
        fill="rgba(161,117,240,0.15)"
      />
      <circle
        :cx="points[activeIndex].x"
        :cy="points[activeIndex].y"
        r="8"
        fill="#a175f0"
      />

      <!-- Score label above active point -->
      <text
        :x="points[activeIndex].x"
        :y="points[activeIndex].y - 16"
        font-size="13"
        font-weight="600"
        fill="#171717"
        text-anchor="middle"
      >{{ formatScore(data[activeIndex].score) }}</text>
    </template>

    <!-- X-axis date labels -->
    <text
      v-for="(point, i) in points"
      :key="`label-${i}`"
      :x="point.x"
      y="176"
      font-size="9.5"
      fill="#aaaaaa"
      text-anchor="middle"
    >{{ data[i].date }}</text>

    <!-- Click hit areas (transparent, large radius for easy tapping) -->
    <circle
      v-for="(point, i) in points"
      :key="`hit-${i}`"
      :cx="point.x"
      :cy="point.y"
      r="22"
      fill="transparent"
      cursor="pointer"
      @click="$emit('selectPoint', i)"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProgressDataPoint } from '@/types/dashboard'

const PADDING = { top: 32, bottom: 38, left: 14, right: 14 }
const VIEW_BOX_WIDTH = 360
const VIEW_BOX_HEIGHT = 180

interface Props {
  data: ProgressDataPoint[]
  activeIndex: number
}

const props = defineProps<Props>()
defineEmits<{ selectPoint: [index: number] }>()

const points = computed(() => {
  const n = props.data.length
  if (n === 0) return []

  const chartWidth = VIEW_BOX_WIDTH - PADDING.left - PADDING.right
  const chartHeight = VIEW_BOX_HEIGHT - PADDING.top - PADDING.bottom

  const scores = props.data.map((d) => d.score)
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)

  const buffer = 0.15 * chartHeight
  const effectiveHeight = chartHeight - 2 * buffer

  return props.data.map((d, i) => {
    const x = n === 1 ? PADDING.left + chartWidth / 2 : PADDING.left + (i / (n - 1)) * chartWidth

    let y: number
    if (minScore === maxScore) {
      y = PADDING.top + chartHeight / 2
    } else {
      y = PADDING.top + buffer + ((maxScore - d.score) / (maxScore - minScore)) * effectiveHeight
    }

    return { x, y }
  })
})

const polylinePoints = computed(() =>
  points.value.map((p) => `${p.x},${p.y}`).join(' '),
)

function formatScore(score: number): string {
  return Number.isInteger(score) ? `${score}.0` : score.toFixed(1)
}
</script>

<style scoped lang="scss">
.progress-chart {
  display: block;
  margin-top: var(--spacing-sm);
}
</style>
