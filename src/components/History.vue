<template>
  <div class="container">
    <Sidebar />
    <div class="nav-title">
      <h1>Transaction History Report</h1>
    </div>

    <div class="filtering-section">
      <div class="filters">
        <select
          v-model="selectedTrack"
          class="filter-dropdown"
          @focus="activeDropdown = 'track'"
          @blur="activeDropdown = ''"
        >
          <option disabled value="">Academic Track</option>
          <option v-for="track in tracks" :key="track">{{ track }}</option>
        </select>

        <select
          v-model="selectedCurriculum"
          class="filter-dropdown"
          @focus="activeDropdown = 'curriculum'"
          @blur="activeDropdown = ''"
        >
          <option disabled value="">Curriculum</option>
          <option v-for="curriculum in curriculums" :key="curriculum">
            {{ curriculum }}
          </option>
        </select>

        <select
          v-model="selectedBatch"
          class="filter-dropdown"
          @focus="activeDropdown = 'batch'"
          @blur="activeDropdown = ''"
        >
          <option disabled value="">Year</option>
          <option v-for="batch in batches" :key="batch">{{ batch }}</option>
        </select>
      </div>

      <div class="search-bar">
        <select
          v-model="selectedfile"
          class="filter-dropdown donwload-report"
          @focus="activeDropdown = 'file'"
          @blur="activeDropdown = ''"
        >
          <option disabled value="">Download Report</option>
          <option v-for="file in files" :key="file">{{ file }}</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>LRN</th>
            <th>STUDENT NAME</th>
            <th>ACADEMIC TRACK</th>
            <th>CURRICULUM</th>
            <th>S.Y. BATCH</th>
            <th>ACADEMIC TRACK</th>
            <th>TIME STAMP</th>
            <th>PRCESSOR</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in 11" :key="index">
            <td>202110048</td>
            <td>Bueno, Ryan Joshua E.</td>
            <td>TVL</td>
            <td>Senior High School</td>
            <td>Batch 2020 - 2025</td>
            <td>TVL - IEM</td>
            <td>3/11/2025 - 7:08:10 PM</td>
            <td>Galileo Galilei</td>
            <td><span class="status released">Released</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="note">
      *Note: Only the most recent 200 students are displayed in the table.
      Students beyond 200 are available in the CSV file.*
    </p>

    <div class="pagination">
      <button class="prev">← Previous</button>
      <button class="page">1</button>
      <button class="page">2</button>
      <button class="page">3</button>
      <button class="next">Next →</button>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "History",
  components: {
    Sidebar,
  },
  data() {
    return {
      selectedBatch: "",
      selectedCurriculum: "",
      selectedTrack: "",
      selectedfile: "",
      searchQuery: "",
      batches: ["All", "2024", "2025", "2026"],
      curriculums: ["All", "JHS Grade 10", "SHS Grade 11", "SHS Grade 12"],
      tracks: ["All", "SPJ", "BEC", "SPA", "HUMSS", "TVL - IEM"],
      files: [".CSV", ".PDF"],
      activeDropdown: "",
    };
  },
};
</script>

<style scoped>
.container {
  margin-top: 80px;
  margin-left: 270px;
  width: 127%;
  padding: 10px;
  box-sizing: border-box;
}

.nav-title h1 {
  color: #295f98;
  font-weight: bold;
}

.filtering-section {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.filters {
  display: flex;
  gap: 10px;
}
.filter-dropdown {
  padding: 15px 20px;
  width: 160px;
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

.filter-dropdown:focus {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 10l5 5 5-5H7z'/></svg>");
}

.search-bar {
  display: flex;
  gap: 10px;
}

.donwload-report {
  cursor: pointer;
  width: 180px;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 12px;
}

th {
  padding-top: 20px;
  background: #f6f6f6;
}

tr {
  cursor: pointer;
}
tr:hover {
  background-color: #f6f6f6;
}

.status.released {
  background: #0c5a48;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
}

.note {
  font-size: 10px;
  text-align: center;
  color: red;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background: #f5f5f5;
  border: none;
  padding: 8px 12px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.page {
  font-weight: bold;
}
</style>
