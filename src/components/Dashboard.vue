<template>
  <div class="container">
    <div class="nav-title">
      <h1>Dashboard</h1>
    </div>

    <div class="dashboard-content">
      <!-- Student Section (First Row) -->
      <div class="student-container">
        <div class="buttons">
          <div class="academic-year">
            <p>High School</p>
          </div>
          <div class="year-filter">
            <p>2023 - 2024 (Filter)</p>
          </div>
        </div>

        <div class="stats-container">
          <div class="stat-card" v-for="(item, index) in 3" :key="index">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <h3>300</h3>
              <p>BEC Students</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Lists (Second Row) -->
      <div class="student-list-container">
        <!-- Total Students -->
        <div class="total-students">
          <div class="container-title">
            <div class="content-title">
              <h3>Total Students</h3>
            </div>
            <div class="year-text">
              <p>2023 - 2024 (Filter)</p>
            </div>
          </div>

          <BarChart :chart-data="chartData" :chart-options="chartOptions" />
        </div>

        <!-- Recent Added -->
        <div class="recent-added">
          <div class="container-title">
            <div class="content-title">
              <h3>Recent Added</h3>
            </div>
            <div class="year-text">
              <p>2023 - 2024 (Filter)</p>
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

      <!-- Recent Released (Third Row) -->
      <div class="document-list-container">
        <div class="recent-released">
          <div class="container-title">
            <div class="content-title">
              <h3>Recent Released</h3>
            </div>
            <div class="year-text">
              <p>2023 - 2024 (Filter)</p>
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
            </li>
          </ul>
        </div>

        <!-- Released Docs -->
        <div class="released-docs">
          <div class="container-title">
            <div class="content-title">
              <h3>Released Docs</h3>
            </div>
            <div class="year-text">
              <p>2023 - 2024 (Filter)</p>
            </div>
          </div>

          <ul>
            <li v-for="(doc, index) in 7" :key="index">
              <span class="list-number">{{ index + 1 }}.</span>
              <span class="doc-name">Transcript #{{ index + 1 }}</span>
              <span class="doc-date">March 2025</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "Dashboard",
  components: {
    BarChart: Bar,
  },
  data() {
    return {
      chartData: {
        labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        datasets: [
          {
            label: "Total Students",
            data: [120, 150, 110, 130],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>


<style scoped>
.container {
  margin-top: 80px;
  margin-left: 270px;
  width: 129%;
  padding: 10px;
  box-sizing: border-box;
}

.nav-title {
  color: #295f98;
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 10px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  width: 100%;
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

.academic-year p,
.year-filter p {
  background-color: #295f98;
  padding: 10px;
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
}

.recent-released {
  width: 75%;
  margin-top: -65px;
}
</style>
