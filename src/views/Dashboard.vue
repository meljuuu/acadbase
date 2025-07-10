<template>
  <div class="container">
    <div class="nav-title">
      <h1>Dashboard</h1>
    </div>

    <div v-if="loading" class="loading">
      Loading dashboard data...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      <div class="student-container">
        <div class="buttons">
          <Dropdown :showCurriculum="true" @update:selectedCurriculum="selectedCurriculum = $event" />
          <Dropdown :showYear="true" :yearOptions="availableYears" @update:selectedYear="selectedSY = $event" />
        </div>
      </div>

      <div class="student-list-container">
        <div className="total-students">
          <div className="container-title">
            <div className="content-title">
              <h3>Total Students</h3>
            </div>
            <div className="filter">
              <select v-model="selectedYearBarChart">
                <option value="">All</option>
                <option v-for="year in years" :key="year" :value="year">
                  {{ year.replace('-', ' - ') }}
                </option>
              </select>
            </div>
          </div>
          <div className="chart-container">
            <BarChart :chart-data="barChartData" />
          </div>
        </div>

        <div class="recent-added">
          <div class="container-title">
            <div class="title-filter-container">
              <div class="content-title">
                <h3>Recent Added</h3>
              </div>

              <div class="filter-container-recent-added">
                <!-- Only Curriculum Filter -->
                <select v-model="selectedCurriculumRecentAdded" class="curriculum-filter">
                  <option value="">All Curriculums</option>
                  <option value="JHS">Junior High School</option>
                  <option value="SHS">Senior High School</option>
                </select>
              </div>
            </div>
          </div>

          <ul>
            <li v-for="(student, index) in filteredRecentAddedStudents" :key="index">
              <span>
                <span class="list-number">{{ index + 1 }}.</span>
                {{ student.name }}
              </span>
              <span class="student-course">{{ student.track }}</span>
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


          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Track</th>
                <th>Curriculum</th>
                <th>Gender</th> <!-- Added Gender column -->
                <th>Release Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in latestMasterlistStudents.slice(0, 10)" :key="student.lrn">
                <td>{{ student.name }}</td>
                <td>{{ student.track }}</td>
                <td>{{ student.school_year }}</td>
                <td>{{ student.gender || '-' }}</td> <!-- Display gender or placeholder -->
                <td>{{ formatDate(student.releaseDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>



        <div class="released-docs">
          <div class="container-title">
            <div class="content-title-docs">
              <h3>Released Docs</h3>
              <select v-model="selectedYearDocs" class="year-filter">
                <option v-for="year in Object.keys(data)" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
          <div class="circle-container">
            <div class="circle">
              <span class="doc-number">{{ filteredData.releasedDocs }}</span>
              <span class="doc-text">Released Documents</span>
            </div>
          </div>

          <div class="stats-doc">
            <div class="stat-box-doc">
              <!-- <p class="stat-number-doc">{{ filteredData.seniorHigh }}</p> -->
              <div class="stat-label-container-doc">
                <div class="stat-icon-doc"></div>
                <div class="stat-label-container-doc-container">
                  <p class="stat-number-doc">{{ filteredData.seniorHigh }}</p>
                  <p class="stat-label-doc">Senior High School</p>
                </div>
              </div>
            </div>
            <div class="stat-box-doc">
              <!-- <p class="stat-number-doc">{{ filteredData.juniorHigh }}</p> -->
              <div class="stat-label-container-doc">
                <div class="stat-icon-doc"></div>
                <div class="stat-label-container-doc-container">
                  <p class="stat-number-doc">{{ filteredData.juniorHigh }}</p>
                  <p class="stat-label-doc">Junior High School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown.vue";
import BarChart from "@/components/BarChart.vue";
import DashboardService from "@/service/DashboardService";
import MasterlistService from "@/service/MasterlistService";
import ReleaseService from "@/service/releaseService";

export default {
  name: "Dashboard",
  components: {
    Dropdown,
    BarChart,
  },
  data() {
    return {
      latestMasterlistStudents: [],
      selectedCurriculum: "Junior High School",
      availableYears: [],
      selectedSY: "2019-2020",
      rawStudentStats: null, // <-- added to keep original stats
      currentPage: 1,
      itemsPerPage: 10,
      selectedCurriculumRecentAdded: "", // Keep this
      studentsRecentAdded: [],
      students: [], // Main student list (aligned with Masterlist.vue)
      studentStats: {},
      selectedYearDocs: "2020 - 2021",
      selectedYearBarChart: "",
      years: [],
      data: {
        "2019 - 2020": { releasedDocs: 0, seniorHigh: 0, juniorHigh: 0 },
        "2020 - 2021": { releasedDocs: 0, seniorHigh: 0, juniorHigh: 0 },
        "2026 - 2027": { releasedDocs: 0, seniorHigh: 0, juniorHigh: 0 },
        "2025 - 2026": { releasedDocs: 0, seniorHigh: 0, juniorHigh: 0 }
      },
      loading: false,
      error: null,
      genderDistribution: {},
    };
  },
  async created() {
    await this.fetchStudents(); // Use the same fetch method as Masterlist.vue
    await this.fetchDashboardStats();
    await this.fetchAvailableGenderDistributionYears();
    await this.fetchGenderDistribution();
    await this.fetchLatestMasterlistStudents();

  },
  watch: {
    selectedSY(newVal) {
      if (this.rawStudentStats) {
        this.studentStats = this.processStudentStats(this.rawStudentStats);
      }
    },
    selectedYearBarChart() {
      this.fetchGenderDistribution();
    }
  },
  computed: {
    uniqueSYs() {
      return [...new Set(this.students.map(student => student.school_year))];
    },
    releasedStudents() {
      let filtered = this.students;
      if (this.selectedSY) {
        filtered = filtered.filter(student => student.school_year === this.selectedSY);
      }
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.releasedStudents.length / this.itemsPerPage);
    },
    filteredStats() {
      if (!this.studentStats || typeof this.studentStats !== 'object') {
        return [];
      }
      return this.selectedCurriculum
        ? this.studentStats[this.selectedCurriculum] || []
        : [];
    },
    filteredStudents() {
      return this.selectedSY
        ? this.students.filter(student => student.school_year === this.selectedSY)
        : this.students;
    },
    filteredRecentAddedStudents() {
      // Filter by curriculum only
      return this.selectedCurriculumRecentAdded
        ? this.students.filter(student => 
            student.curriculum === this.selectedCurriculumRecentAdded
          )
        : this.students;
    },
    filteredData() {
      return this.data[this.selectedYearDocs] || { releasedDocs: 0, seniorHigh: 0, juniorHigh: 0 };
    },
    barChartData() {
      const dist = this.genderDistribution || {};
      return {
        labels: ['JHS Male', 'JHS Female', 'SHS Male', 'SHS Female'],
        datasets: [
          {
            label: 'Total Students',
            backgroundColor: ['#295f98', '#295f98', '#295f98', '#295f98'],
            data: [
              dist.JHS_Male || 0,
              dist.JHS_Female || 0,
              dist.SHS_Male || 0,
              dist.SHS_Female || 0
            ]
          }
        ]
      };
    },
    // Add unique curriculums for display (optional)
    uniqueCurriculums() {
      return [...new Set(this.studentsRecentAdded.map(student => student.curriculum))];
    }
  },
  methods: {
    async fetchStudents() {
      this.loading = true;
      try {
        const response = await MasterlistService.filterStudents({
          // Use the same filters as Masterlist.vue (empty for all students)
        });
        
        this.students = response.data.map(student => ({
          ...student,
          name: student.name || '-',
          track: student.track || '-',
          curriculum: student.curriculum || '-',
          batch: student.batch || '-',
          status: student.status || 'Not-Applicable'
        }));
      } catch (error) {
        this.error = 'Failed to load students: ' + error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchDashboardStats() {
      // Fetch dashboard-specific stats (charts, etc.)
      try {
        const [studentStats, releasedDocsStats] = await Promise.all([
          DashboardService.getStudentStats(),
          DashboardService.getReleasedDocsStats(),
        ]);
        // Process stats as before...
        this.rawStudentStats = studentStats;
        this.studentStats = this.processStudentStats(studentStats);

        this.data = this.processReleasedDocsData(releasedDocsStats);

        const trackStats = studentStats.track_stats || {};
        this.availableYears = Object.keys(trackStats);

        if (!this.selectedSY && this.availableYears.length) {
          this.selectedSY = this.availableYears[0];
        }

        const years = Object.keys(this.data);
        if (years.length && !this.selectedYearDocs) {
          this.selectedYearDocs = years[0];
        }

      } catch (error) {
        this.error = 'Failed to load dashboard stats';
      }
    },
    processStudentStats(stats) {
      const selectedYear = this.selectedSY || '';
      const trackStats = stats.track_stats || {};
      const yearStats = trackStats[selectedYear] || {};

      return {
        "Junior High School": [
          { label: "BEC Students", count: yearStats['JHS']?.['BEC'] || 0 },
          { label: "SPA Students", count: yearStats['JHS']?.['SPA'] || 0 },
          { label: "SPJ Students", count: yearStats['JHS']?.['SPJ'] || 0 }

        ].filter(item => item.count > 0),

        "Senior High School": [
          { label: "Academic Students", count: yearStats['SHS']?.['Academic'] || 0 },
          { label: "Technical Professional Students", count: yearStats['SHS']?.['Technical Professional'] || 0 }
        ].filter(item => item.count > 0)
      };
    },
    processReleasedDocsData(stats) {
      const result = {};
      const released = stats.released_docs || {};
      const curriculum = stats.curriculum_stats || {};

      Object.keys(released).forEach(year => {
        result[year.replace('-', ' - ')] = {
          releasedDocs: released[year],
          seniorHigh: curriculum['SHS'] || 0,
          juniorHigh: curriculum['JHS'] || 0
        };
      });

      return result;
    },
    async fetchGenderDistribution() {
      try {
        const params = this.selectedYearBarChart
          ? { sy_year: this.selectedYearBarChart }
          : {};
        const genderDistribution = await DashboardService.getGenderDistribution(params);
        this.genderDistribution = genderDistribution;
      } catch (error) {
        this.genderDistribution = {};
      }
    },
    async fetchLatestMasterlistStudents() {
      try {
        const response = await MasterlistService.getAllStudents();
        const students = response.data; // <-- this is the array of students from the paginated response

        this.latestMasterlistStudents = students
          .map(student => ({
            name: student.name,
            track: student.track,
            school_year: student.curriculum,
            lrn: student.lrn,
            releaseDate: student.created_at,
            gender: student.gender, // Ensure gender is included
            status: student.status // Ensure status is included
          }))
          .filter(student => student.status === "Released") // Filter for "Released" status
          .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)); // sort by latest
      } catch (error) {
        console.error('Error fetching masterlist students:', error);
        this.latestMasterlistStudents = [];
      }
    },

    async fetchAvailableGenderDistributionYears() {
      try {
        const response = await DashboardService.getGenderDistributionYears();
        this.years = Array.isArray(response) ? response : [];
        if (!this.selectedYearBarChart && this.years.length > 0) {
          this.selectedYearBarChart = "";
        }
      } catch (error) {
        this.years = [];
      }
    },
    formatDate(date) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }).format(new Date(date));
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>


<style scoped>
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  font-size: 1.2rem;
}

.total-students {
  width: 100%;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
}

.container-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.content-title h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.filter select {
  padding: 15px 20px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.chart-container {
  width: 100%;
  height: 450px;
  display: flex;
  justify-content: center;
}

.container {
  margin-top: 70px;
  margin-left: 290px;
  width: 125%;
  padding: 10px;
  box-sizing: border-box;
}

.nav-title h1 {
  color: #295f98;
  font-weight: bold;
  font-size: 48px;
  padding: 0;
  margin: 0;
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
  margin: 20px 0;
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
  font-size: 64px;
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
  padding: 20px;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  margin-bottom: 20px;
}

.recent-added {
  width: 300px;
  height: 550px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 20px;
  background-color: #ffffff;
}

.title-filter-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.filter-container-recent-added select {
  padding: 15px 20px;
  font-size: 14px;
  min-width: 150px;
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
  font-size: 14px;
  background-color: #f5f5f5;
}

.list-number {
  font-weight: bold;
  margin-right: 8px;
}

.container-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-container label {
  font-weight: bold;
  color: #295f98;
}

select {
  padding: 15px 20px;
  width: 180px;
  border: 1px solid #295f98;
  border-radius: 5px;
  font-size: 14px;
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

select:hover,
select:focus {
  border-color: #1f4b7a;
  box-shadow: 0 0 5px rgba(41, 95, 152, 0.5);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 10l5 5 5-5H7z'/></svg>");

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
  height: 558px;
}

.content-title-docs {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.content-title-docs h3 {
  margin: 0;
}

.year-filter {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px 20px;
  font-size: 14px;
  border-color: #1f4b7a;
}

.circle-container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.circle {
  width: 230px;
  height: 230px;
  border-radius: 50%;
  border: 20px solid #1E3A8A;
  display: flex;
  flex-direction: column;
  /* Align items in a column */
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.doc-number {
  font-size: 24px;
  font-weight: bold;
}

.doc-text {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

.stats-doc {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  gap: 10px;
}

.stat-box-doc {
  background: #f0f0f0;
  border-radius: 5px;
  padding: 15px;
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stat-number-doc {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.stat-label-container-doc {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.stat-icon-doc {
  width: 10px;
  height: 40px;
  background-color: #1E3A8A;
  margin-right: 8px;
  border-radius: 10px;
}

.stat-label-doc {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.recent-released {
  width: 74.8%;
  margin-top: -37px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

td {
  font-size: 14px;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}
</style>
