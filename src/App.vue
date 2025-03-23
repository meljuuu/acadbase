<template>
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
</script>

const router = useRouter();
const route = useRoute();
const isAuthenticated = ref(!!localStorage.getItem("userToken"));

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

