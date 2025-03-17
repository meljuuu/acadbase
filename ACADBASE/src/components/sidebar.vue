<template>
    <div class="sidebar">
      <div class="profile-section">
        <img src="../assets/school-logo.png" alt="Profile" class="profile-icon" />
        <p>Admin</p>
        <hr />
      </div>
  
      <ul class="menu">
        <li class="menu-item active">
          <i class="fas fa-th-large"></i>
          <span>Dashboard</span>
        </li>
        <li class="menu-item">
          <i class="fas fa-clipboard-list"></i>
          <span>Masterlist</span>
        </li>
        <li class="menu-item">
          <i class="fas fa-history"></i>
          <span>History</span>
        </li>
      </ul>
  
      <button class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: "Sidebar",
  };
  </script>
  
  <style scoped>
.sidebar {
  width: 220px;
  height: 100vh; /* Full viewport height */
  background-color: #295f98;
  padding: 20px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex; /* Enables flexbox */
  flex-direction: column; /* Stack items vertically */
  justify-content: space-between; /* Push logout button to the bottom */
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto; /* Scroll if content overflows */
}

  
  .profile-section {
    text-align: center;
    color: white;
    margin-bottom: 20px;
  }
  
  .profile-icon {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    padding: 10px;
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
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    transition: 0.3s;
  }
  
  .menu-item:hover,
  .menu-item.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .logout-btn {
    margin-top: auto;
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
    gap: 10px;
  }
  
  .logout-btn:hover {
    background-color: #092c47;
  }
  </style>
  