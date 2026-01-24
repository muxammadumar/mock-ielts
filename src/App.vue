<template>
  <router-view />
  <Loading />
</template>

<script setup lang="ts">
import Loading from '@/components/common/Loading.vue'
</script>

<style scoped lang="scss">
#app {
  width: 100svw;
  height: 100dvh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
