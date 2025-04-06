<template>
  <div>
    <button @click="$emit('open-modal')" class="import-class-list">
      Import Class List
    </button>
  </div>
</template>

<script>
export default {
  name: "ImportClassListButton",
};
</script>

<style scoped>
.import-class-list {
  background: #295f98;
  color: #fff;
  border: none;
  padding: 15px 20px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.import-class-list:hover {
  background: #1f4b79;
}
</style>
