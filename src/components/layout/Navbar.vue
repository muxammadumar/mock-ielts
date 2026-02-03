<template>
  <div class="navbar">
    <div
      :class="['navbar-item', activeIndex === item.name ? 'active' : '']"
      v-for="item in menu"
      :key="item.name"
      @click="handleNavClick(item.name)"
    >
      <Icon
        :name="item.icon"
        size="24px"
        :color="activeIndex === item.name ? '#A175F0' : '#A4A4A4'"
      />
      <span class="navbar-item-label">{{ $t(`navbar.${item.translationKey}`) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/common/Icon.vue'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const activeIndex = computed(() => {
  return route.name
})

const menu = [
  {
    name: 'home',
    icon: 'home',
    translationKey: 'home',
  },
  {
    name: 'mock-test',
    icon: 'notebook',
    translationKey: 'mockTest',
  },
  {
    name: 'settings',
    icon: 'gear',
    translationKey: 'settings',
  },
]

const handleNavClick = (routeName: string | symbol) => {
  router.push({ name: routeName as string })
}
</script>

<style scoped lang="scss">
.navbar {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 18px 34px;
    background-color: #ffffff;
    box-shadow: 0px -7px 24px 0px #CFD1EF30;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2;
    gap: 28px;
    &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 100%;
        cursor: pointer;
        font-size: 12px;
        &.active {
            color: var(--color-primary);
        }
    }
}
</style>
