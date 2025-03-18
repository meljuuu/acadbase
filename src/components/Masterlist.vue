<template>
  <div class="container">
    <div class="nav-title">
      <h1>Master List</h1>
    </div>

    <div class="filtering-section">
      <div class="filters">
        <select
          v-model="selectedBatch"
          class="filter-dropdown"
          @focus="activeDropdown = 'batch'"
          @blur="activeDropdown = ''"
        >
          <option disabled value="">Select Batch</option>
          <option v-for="batch in batches" :key="batch">{{ batch }}</option>
        </select>

        <select
          v-model="selectedCurriculum"
          class="filter-dropdown"
          @focus="activeDropdown = 'curriculum'"
          @blur="activeDropdown = ''"
        >
          <option disabled value="">Select Curriculum</option>
          <option v-for="curriculum in curriculums" :key="curriculum">
            {{ curriculum }}
          </option>
        </select>

        <select
          v-model="selectedTrack"
          class="filter-dropdown"
          @focus="activeDropdown = 'track'"
          @blur="activeDropdown = ''"
        >
          <option disabled value="">Select Academic Track</option>
          <option v-for="track in tracks" :key="track">{{ track }}</option>
        </select>
      </div>

      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search..." />
        <button class="add-student">Add Student</button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>LRN</th>
            <th>NAME OF STUDENT</th>
            <th>ACADEMIC TRACK</th>
            <th>CURRICULUM</th>
            <th>S.Y. BATCH</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in 10" :key="index">
            <td>202110048</td>
            <td>Bueno, Ryan Joshua E.</td>
            <td>TVL - IEM</td>
            <td>Senior High School</td>
            <td>Batch 2020 - 2025</td>
            <td><span class="status released">Released</span></td>
          </tr>
        </tbody>
      </table>
    </div>

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
export default {
  name: "Masterlist",
  data() {
    return {
      selectedBatch: "",
      selectedCurriculum: "",
      selectedTrack: "",
      searchQuery: "",
      batches: ["Batch 2023 - 2024", "Batch 2024 - 2025", "Batch 2025 - 2026"],
      curriculums: ["SHS", "JHS", "College"],
      tracks: ["STEM", "HUMSS", "ABM", "TVL"],
      activeDropdown: "",
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
  padding: 8px;
  width: 185px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  background: white;
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

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 500px;
}

.add-student {
  background: #295f98;
  color: #fff;
  border: none;
  padding: 15px 20px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
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
