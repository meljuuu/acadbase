<template>
  <div>
    <button @click="$emit('open-modal-modal')" class="add-student">Add Student</button>
  </div>
</template>

<script>
export default {
  name: "Buttons",
};
</script>

<style scoped>
.add-student {
  background: #295f98;
  color: #fff;
  border: none;
  padding: 15px 20px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.add-student:hover {
  background: #1f4b79;
}
</style>
