<template>
  <div class="app-container">
    <Header />
    <sidebar />
    <router-view />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import sidebar from './components/sidebar.vue';
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
}

.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.sidebar {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

