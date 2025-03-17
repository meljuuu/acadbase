<template>
  <div class="container">
    <div class="nav-title">
      <h1>Dashboard</h1>
    </div>

    <div class="dashboard-content">

      <!-- First Card -->
      <div class="student-container">
        <div class="buttons">
          <div class="academic-year">
            <p>Highschool</p>
          </div>
          <div class="year-filter">
            <p>2023 - 2024 (Filter)</p>
          </div>
        </div>
        
      </div>


    </div>
  </div>
  </template>
  
  <script>
  export default {
    name: "Dashboard",
  };
  </script>
  
  <style scoped>
  .container{
    margin-top: 100px;
    margin-left: 270px;
  }
  .nav-title{
    color: #295f98;
    font-weight: bold;
    font-size: 22px;
  }

  .student-container{
    background-color: #ffffff;
    padding: 20px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    border-radius: 5px;
  }

  .buttons{
    display: flex;
    justify-content: space-between;
    color: #ffffff;
  }

  .academic-year p,
  .year-filter p{
    background-color: #295f98;
    padding: 10px;
    border-radius: 3px;
    cursor: pointer;
  }
  </style>
  