<template>
  <div class="main-layout">
    <main>
      <router-view />
    </main>
    <footer>
      <Navbar />
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.main-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  footer {
    flex-shrink: 0;
  }
}
</style>
