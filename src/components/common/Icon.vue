<template>
  <span :class="['icon', props.class]" :style="iconStyle" v-html="svgContent" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  name: string
  class?: string
  size?: string | number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  size: undefined,
  color: undefined,
})

const svgContent = ref<string>('')

const iconUrl = computed(() => {
  return new URL(`../../assets/icons/${props.name}.svg`, import.meta.url).href
})

const iconStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.size) {
    const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
    style.width = sizeValue
    style.height = sizeValue
  }

  if (props.color) {
    style.color = props.color
  }

  return style
})

watch(
  () => props.name,
  async () => {
    try {
      const response = await fetch(iconUrl.value)
      console.log(iconUrl.value)
      svgContent.value = await response.text()
    } catch (error) {
      console.error(`Failed to load icon: ${props.name}`, error)
      svgContent.value = ''
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
