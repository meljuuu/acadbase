<template>
  <div>
    <nav class="navbar">
      <div class="navbar-content">
        <img src="../assets/school-logo.png" alt="School Logo" class="navbar-logo" />
      </div>
    </nav>

    <div class="sidebar">
      <div class="profile-section">
        <img src="../assets/school-logo.png" alt="Profile" class="profile-icon" />
        <p>Admin</p>
        <hr />
      </div>

      <ul class="menu">
        <router-link to="/dashboard" custom v-slot="{ navigate, isActive }">
          <li :class="['menu-item', { active: isActive }]" @click="navigate">
            <i class="fas fa-th-large"></i>
            <span>Dashboard</span>
          </li>
        </router-link>

        <router-link to="/masterlist" custom v-slot="{ navigate, isActive }">
          <li :class="['menu-item', { active: isActive }]" @click="navigate">
            <i class="fas fa-clipboard-list"></i>
            <span>Masterlist</span>
          </li>
        </router-link>

        <router-link to="/history" custom v-slot="{ navigate, isActive }">
          <li :class="['menu-item', { active: isActive }]" @click="navigate">
            <i class="fas fa-history"></i>
            <span>History</span>
          </li>
        </router-link>
      </ul>

      <button class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
};
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 80px;
  background-color: #295F98;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 10px;
}

.navbar-logo {
  height: 80px;
  border-radius: 50%;
  margin-right: 30px;
}

.sidebar {
  width: 220px;
  height: 100%;
  background-color: #295f98;
  padding: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.profile-section {
  text-align: center;
  margin-bottom: 20px;
}

.profile-icon {
  width: 120px;
  height: 120px;
  padding: 0;
  border-radius: 50%;
}

p {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
}

hr {
  border: 0;
  height: 1px;
  background-color: white;
  width: 100%;
  margin-top: 10px;
}

.menu {
  list-style: none;
  padding: 0;
  width: 100%;
}

a {
  text-decoration: none;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
  list-style: none;
}

.menu-item:hover,
.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn {
  margin-top: auto;
  margin-bottom: 50px;
  width: 100%;
  padding: 12px;
  background-color: #0a3d62;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.logout-btn:hover {
  background-color: #092c47;
}
</style>
