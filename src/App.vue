<template>
  <div class="app-container">
    <Header v-if="!isLoginPage" />
    <Sidebar v-if="!isLoginPage" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";

const route = useRoute();
const isLoginPage = computed(() => route.path === "/" || route.path === "/login");
</script>

<style>
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
