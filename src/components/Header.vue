<template>
  <nav class="navbar">
    <div class="navbar-content">
      <img
        src="../assets/logo.png"
        alt="School Logo"
        class="navbar-logo"
      />
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 50px;
  background-color: #295f98;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 10px;

}

.navbar-logo {
  height: 60px;
  margin-right: 30px;
}
</style>