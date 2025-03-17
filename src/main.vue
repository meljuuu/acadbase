<template>
  <div class="app-container">
    <Sidebar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
}

.content {
  flex: 1;
  height: 100%;
  width: 100%;
  padding: 20px;
  overflow: auto;
}
</style>
