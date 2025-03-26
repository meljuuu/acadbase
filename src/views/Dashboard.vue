<template>
  <div class="container">
    <div class="nav-title">
      <h1>Dashboard</h1>
    </div>

    <div class="dashboard-content">
      <div class="student-container">
        <div class="buttons">
          <Dropdown :showCurriculum="true" @update:selectedCurriculum="selectedCurriculum = $event" />
          <Dropdown :showYear="true" @update:selectedYear="selectedYear = $event" />
        </div>
        
        <div class="stats-container" v-if="filteredStats.length">
          <div v-for="(stat, index) in filteredStats" :key="index" class="stat-card">
            <div class="stat-icon">📖</div>
            <div class="stat-info">
              <h3>{{ stat.count }}</h3>
              <p>{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="student-list-container">
        <div className="total-students">
          <div className="container-title">
            <div className="content-title">
              <h3>Total Students</h3>
            </div>
            <div className="filter">
              <select>
                <option value="2024 - 2025">2024 - 2025</option>
                <option value="2023 - 2024">2023  2024</option>
                <option value="2022 - 2023">2022 - 2023</option>
              </select>
            </div>
          </div>

          <div className="chart-container">
            <BarChart />
          </div>
        </div>

        <div class="recent-added">
          <div class="container-title">
            <div class="title-filter-container">
              <div class="content-title">
                <h3>Recent Added</h3>
              </div>

              <div class="filter-container-recent-added">
                <select v-model="selectedSYRecentAdded" id="recentAddedFilter">
                  <option value="">All</option>
                  <option v-for="batch in uniqueSYsRecentAdded" :key="batch" :value="batch">
                    {{ batch }}
                  </option>
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
            <div class="filter-container">
              <label for="syFilter">Filter by Batch:</label>
              <select v-model="selectedSY" id="syFilter">
                <option value="">All</option>
                <option v-for="batch in uniqueSYs" :key="batch" :value="batch">{{ batch }}</option>
              </select>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <!-- <th>#</th> -->
                <th>Name</th>
                <th>Track</th>
                <th>Batch</th>
                <th>Release Date & Time</th>
                
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in releasedStudents" :key="student.lrn">
                <!-- <td>{{ index + 1 }}</td> -->
                <td>{{ student.name }}</td>
                <td>{{ student.track }}</td>
                <td>{{ student.batch }}</td>
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
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
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
              <p class="stat-number-doc">{{ filteredData.seniorHigh }}</p>
              <div class="stat-label-container-doc">
                <div class="stat-icon-doc"></div>
                <p class="stat-label-doc">Senior High School</p>
              </div>
            </div>
            <div class="stat-box-doc">
              <p class="stat-number-doc">{{ filteredData.juniorHigh }}</p>
              <div class="stat-label-container-doc">
                <div class="stat-icon-doc"></div>
                <p class="stat-label-doc">Junior High School</p>
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

export default {
  name: "Dashboard",
  components: {
    Dropdown,
    BarChart,
  },
  data() {
    return {
      selectedCurriculum: "JHS Grade 10",
      selectedSY: "",
      currentPage: 1,
      itemsPerPage: 10,
      selectedSYRecentAdded: "",
      studentsRecentAdded: [
        { name: "John Doe", track: "TVL-ICT", batch: "2024", level: "SHS" },
        { name: "Jane Smith", track: "HUMSS", batch: "2023", level: "SHS" },
        { name: "Michael Johnson", track: "SPJ", batch: "2025", level: "SHS" },
        { name: "Emily Davis", track: "BEC", batch: "2024", level: "JHS" },
        { name: "Daniel Martinez", track: "TVL-HE", batch: "2026", level: "SHS" },
        { name: "Sophia Garcia", track: "SPA", batch: "2025", level: "SHS" },
        { name: "Christopher Wilson", track: "STEM", batch: "2024", level: "SHS" },
        { name: "Olivia Brown", track: "ABM", batch: "2026", level: "SHS" },
        { name: "Matthew Taylor", track: "BEC", batch: "2027", level: "JHS" },
        { name: "Isabella Anderson", track: "GAS", batch: "2026", level: "SHS" }
      ],
      students: [
        { lrn: "202110048", name: "Bueno, Ryan Joshua E.", track: "TVL", batch: "Batch 2020 - 2025", curriculum: "Senior High School", processor: "Galileo Galilei", status: "Released", releaseDate: new Date() },
        { lrn: "202110050", name: "Reyes, Maria Clara", track: "BEC", batch: "Batch 2022 - 2025", curriculum: "JHS Grade 10", processor: "Albert Einstein", status: "Released", releaseDate: new Date() },
        { lrn: "202110052", name: "Gonzales, Angela R.", track: "SPJ", batch: "Batch 2024 - 2027", curriculum: "SHS Grade 11", processor: "Marie Curie", status: "Released", releaseDate: new Date() },
        { lrn: "202110054", name: "Torres, Miguel A.", track: "HUMSS", batch: "Batch 2023 - 2026", curriculum: "SHS Grade 12", processor: "Isaac Newton", status: "Released", releaseDate: new Date() },
        { lrn: "202110056", name: "Navarro, Crisostomo I.", track: "SPA", batch: "Batch 2021 - 2024", curriculum: "Senior High School", processor: "Nikola Tesla", status: "Released", releaseDate: new Date() },
        { lrn: "202110058", name: "Rizal, Jose P.", track: "HUMSS", batch: "Batch 2022 - 2025", curriculum: "Senior High School", processor: "Galileo Galilei", status: "Released", releaseDate: new Date() },
        { lrn: "202110061", name: "Aguinaldo, Emilio", track: "SPJ", batch: "Batch 2024 - 2027", curriculum: "Senior High School", processor: "Nikola Tesla", status: "Released", releaseDate: new Date() },
        { lrn: "202110064", name: "Silang, Gabriela", track: "TVL", batch: "Batch 2022 - 2025", curriculum: "JHS Grade 10", processor: "Isaac Newton", status: "Released", releaseDate: new Date() },
        { lrn: "202110066", name: "Tandang Sora, Melchora", track: "SPJ", batch: "Batch 2024 - 2027", curriculum: "Senior High School", processor: "Nikola Tesla", status: "Released", releaseDate: new Date() },
        { lrn: "202110067", name: "Tandang Sora, Melody", track: "SPS", batch: "Batch 2024 - 2027", curriculum: "Senior High School", processor: "Nikola Tesla", status: "Released", releaseDate: new Date() },
      ],
      selectedCurriculum: null,
      selectedYear: null,
      studentStats: {
        "JHS Grade 10": [
          { label: "SPJ Students", count: 300 },
          { label: "BEC Students", count: 300 },
          { label: "SPA Students", count: 300 },
        ],
        "SHS Grade 11": [
          { label: "HUMSS Grade 11 Students", count: 300 },
          { label: "TVL - IEM Grade 11 Students", count: 300 },
        ],
        "SHS Grade 12": [
          { label: "HUMSS Grade 12 Students", count: 300 },
          { label: "TVL - IEM Grade 12 Students", count: 300 },
        ],
      },
      selectedYearDocs: "2023 - 2024",
      years: ["2022 - 2023", "2023 - 2024", "2024 - 2025"],
      data: {
        "2023 - 2024": { releasedDocs: 3003, seniorHigh: 10000, juniorHigh: 10000 },
        "2022 - 2023": { releasedDocs: 2800, seniorHigh: 9500, juniorHigh: 9700 },
        "2024 - 2025": { releasedDocs: 3200, seniorHigh: 11000, juniorHigh: 10500 }
      },
    };
  },
  computed: {
    releasedStudents() {
      let filtered = this.students;
      if (this.selectedSY) {
        filtered = filtered.filter(student => student.batch === this.selectedSY);
      }
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(start, start + this.itemsPerPage);
      },
      totalPages() {
        return Math.ceil(this.releasedStudents.length / this.itemsPerPage);
      },
      uniqueSYs() {
        return [...new Set(this.students.map(student => student.batch))];
      },
      filteredStats() {
        return this.selectedCurriculum ? this.studentStats[this.selectedCurriculum] || [] : [];
      },
      getUniqueBatches() {
      return [...new Set(this.students.map(student => student.batch))];
      },
      filteredStudents() {
        return this.selectedSY
          ? this.students.filter(student => student.batch === this.selectedSY)
          : this.students;
      },
      uniqueSYsRecentAdded() {
        return [...new Set(this.studentsRecentAdded.map(student => student.batch))];
      },
      filteredRecentAddedStudents() {
        return this.selectedSYRecentAdded
          ? this.studentsRecentAdded.filter(student => student.batch === this.selectedSYRecentAdded)
          : this.studentsRecentAdded;
      },
      filteredData() {
        return this.data[this.selectedYearDocs];
      }
    },
  
  methods: {
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
    },
  }
};
</script>

<style scoped>

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
  padding: 5px 10px;
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

.recent-added {
  width: 300px; 
  height: 550px; 
  overflow-y: auto; 
  border: 1px solid #ddd; 
  padding: 15px;
  background-color: #ffffff;
}

.title-filter-container {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  width: 100%;
}

.filter-container-recent-added select {
  padding: 6px 10px;
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
  height: 535px;
}

.content-title-docs {
  align-items: center; 
  display: flex;
  justify-content: space-between;
  width: 100%; 
}

.year-filter {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  font-size: 14px;
  border-color: #1f4b7a;
}

.circle-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.circle {
  width: 230px;
  height: 230px;
  border-radius: 50%;
  border: 20px solid #1E3A8A;
  display: flex;
  flex-direction: column; /* Align items in a column */
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
  font-size: 14px;
  color: #666;
  margin-top: 5px; 
}

.stats-doc {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px; 
}

.stat-box-doc {
  background: #f0f0f0;
  border-radius: 5px;
  padding: 15px;
  width: 45%;
  display: flex;
  flex-direction: column;
}

.stat-number-doc {
  font-size: 18px;
  font-weight: bold;
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
  font-size: 12px;
  color: #666;
}

.recent-released {
  width: 75%;
  margin-top: -65px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}
</style>
