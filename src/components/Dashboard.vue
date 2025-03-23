<template>
  <div class="container">
    <Sidebar />
    <div class="nav-title">
      <h1>Dashboard</h1>
    </div>

    <div class="dashboard-content">
      <div class="student-container">
        <div class="buttons">
          <div class="dropdown-container">
            <select
              v-model="selectedCurriculum"
              class="filter-dropdown"
              @focus="activeDropdown = ''"
              @blur="activeDropdown = ''"
            >
              <option disabled value="">Curriculum</option>
              <option v-for="curriculum in curriculums" :key="curriculum">
                {{ curriculum }}
              </option>

            </select>
          </div>

          <div class="year-filter">
            <select
              v-model="selectedYear"
              class="filter-dropdown"
              @focus="activeDropdown = ''"
              @blur="activeDropdown = ''"
            >
              <option disabled value="">School Year</option>
              <option v-for="year in years" :key="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>

        <div class="stats-container" v-if="selectedCurriculum === 'Junior High School'">
          <div class="stat-card">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <h3>300</h3>
              <p>SPJ Students</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <h3>300</h3>
              <p>BEC Students</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <h3>300</h3>
              <p>SPA Students</p>
            </div>
          </div>
        </div>

        <div class="stats-container" v-if="selectedCurriculum === 'G11 Senior High School'">
          <div class="stat-card">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <h3>300</h3>
              <p>HUMSS Grade 11 Students</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <h3>300</h3>
              <p>TVL - IEM Grade 11 Students</p>
            </div>
          </div>
        </div>

        <div class="stats-container" v-if="selectedCurriculum === 'G12 Senior High School'">
          <div class="stat-card">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <h3>300</h3>
              <p>HUMSS Grade 12 Students</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <h3>300</h3>
              <p>TVL - IEM Grade 12 Students</p>
            </div>
          </div>
        </div>
      </div>

      <div class="student-list-container">
        <div class="total-students">
          <div class="container-title">
            <div class="content-title">
              <h3>Total Students</h3>
            </div>
          </div>

          <BarChart :chart-data="chartData" :chart-options="chartOptions" />
        </div>

        <div class="recent-added">
          <div class="container-title">
            <div class="content-title">
              <h3>Recent Added</h3>
            </div>
          </div>

          <ul>
            <li v-for="(student, index) in 10" :key="index">
              <span
                ><span class="list-number">{{ index + 1 }}.</span>Ryan Joshua
                Bueno</span
              >
              <span class="student-course">TVL • IEM</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="document-list-container">
        <div class="recent-released">
          <div class="container-title">
            <div class="content-title">
              <h3>Recent Released</h3>
            </div>
          </div>

          <ul>
            <li v-for="(doc, index) in 10" :key="index">
              <span
                ><span class="list-number">{{ index + 1 }}.</span>Ryan Joshua
                Bueno</span
              >
              <span>TVL - IEM</span>
              <span>2023 - 2024</span>
              <span>03 / 10 / 2025</span>
              <span>Galileo Galilei</span>
            </li>
          </ul>
        </div>

        <div class="released-docs">
          <div class="container-title">
            <div class="content-title">
              <h3>Released Docs</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "Dashboard",
  components: {
    Sidebar,
  },
  data() {
    return {
      selectedYear: "",
      selectedCurriculum: "Junior High School",
      curriculums: [ "Junior High School", "G11 Senior High School", "G12 Senior High School"],
      years: ["2022", "2023", "2024", "2025", "2026"],
      activeDropdown: "",
    };
  },
};
</script>

<style scoped>
.container {
  margin-top: 50px;
  margin-left: 270px;
  width: 127%;
  padding: 10px;
  box-sizing: border-box;
}

.nav-title h1 {
  color: #295f98;
  font-weight: bold;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.dropdown-container{
  display: flex;
  gap: 10px;
}

.filter-dropdown {
  padding: 15px 20px;
  width: 210px;
  border: 1px solid #295f98;
  border-radius: 5px;
  font-size: 14px;
  margin: 20px 0;
  background: #fff;
  font-weight: bold;
  color: #295f98;
  cursor: pointer;
  appearance: none;
  position: relative;
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  transition: all 0.3s ease-in-out;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M14 7l-5 5 5 5V7z'/></svg>");
}

.filter-dropdown:focus {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 10l5 5 5-5H7z'/></svg>");
}


.student-container {
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  flex-wrap: wrap;
  gap: 10px;
}

.status.released {
  background: #0c5a48;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
}

.academic-year p,
.year-filter p {
  background-color: #295f98;
  padding: 15px 20px;
  border-radius: 3px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  min-width: 120px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 10px;
}

.stat-card {
  background-color: #f5f5f5;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  text-align: left;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
}

.stat-icon {
  font-size: 50px;
  min-width: 50px;
}

.stat-info h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.stat-info p {
  font-size: 14px;
  color: gray;
  margin: 0;
}

.student-list-container {
  display: flex;
  gap: 20px;
}

.total-students,
.recent-added,
.recent-released,
.released-docs {
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  margin-bottom: 20px;
}

.total-students {
  width: 75%;
  height: 40%;
  min-height: 500px;
}

.recent-added,
.recent-released,
.released-docs {
  width: 25%;
}

.recent-added ul,
.recent-released ul,
.released-docs ul {
  list-style-type: decimal;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-added li,
.recent-released li,
.released-docs li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  font-size: 12px;
  background-color: #f5f5f5;
}

.list-number {
  font-weight: bold;
  margin-right: 8px;
}

.container-title {
  display: flex;
  justify-content: space-between;
}

.document-list-container {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.recent-released {
  height: 600px;
}
.released-docs {
  height: 535px;
}

.recent-released {
  width: 75%;
  margin-top: -65px;
}
</style>
