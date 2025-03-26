<template>
  <div class="container">
    <div class="nav-title">
      <h1>Master List</h1>
    </div>

    <div class="filtering-section">
      <div class="filters">
        <Dropdown :showBatch="true" @update:selectedBatch="selectedBatch = $event"/>
        <Dropdown :showCurriculum="true" @update:selectedCurriculum="selectedCurriculum = $event"/>
        <Dropdown :showTrack="true" @update:selectedTrack="selectedTrack = $event"/>
      </div>

      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search..." />
        <Buttons @click="openaddModal"/>
        <Modal ref="addModalRef" />
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
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in paginatedStudents" :key="index" @click="showUnReleasedModal">
            <td>{{ student.lrn }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.track }}</td>
            <td>{{ student.curriculum }}</td>
            <td>{{ student.batch }}</td>
            <td><span :class="['status', student.status.toLowerCase()]">{{ student.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal ref="unreleasedModalRef" />

    <p class="note">
      *Note: Only 20 students are displayed in the table. Other students Name
      are on the next page.*
    </p>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">← Previous</button>
      <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="{ active: currentPage === page }">
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next →</button>
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown.vue";
import Buttons from "@/components/Buttons.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "Masterlist",
  components: {
    Dropdown,
    Buttons,
    Modal,
  },
  data() {
    return {
      selectedBatch: "",
      selectedCurriculum: "",
      selectedTrack: "",
      searchQuery: "",
      uploadedFile: null,
      pdfUrl: "",
      students: [
      { lrn: "202110048", name: "Bueno, Ryan Joshua E.", track: "TVL - IEM", batch: "S.Y 2020 - 2021", curriculum: "Senior High School", status: "Released" },
        { lrn: "202110049", name: "Dela Cruz, Juan", track: "HUMSS", batch: "S.Y 2021 - 2022", curriculum: "Senior High School", status: "Pending" },
        { lrn: "202110050", name: "Reyes, Maria Clara", track: "BEC", batch: "S.Y 2022 - 2023", curriculum: "JHS Grade 10", status: "Released" },
        { lrn: "202110051", name: "Santos, Pedro P.", track: "SPA", batch: "S.Y 2023 - 2024", curriculum: "SHS Grade 12", status: "Processing" },
        { lrn: "202110052", name: "Gonzales, Angela R.", track: "SPJ", batch: "S.Y 2024 - 2025", curriculum: "SHS Grade 11", status: "Released" },
        { lrn: "202110053", name: "Mendoza, Paul J.", track: "TVL", batch: "S.Y 2020 - 2021", curriculum: "Senior High School", status: "Pending" },
        { lrn: "202110054", name: "Torres, Miguel A.", track: "HUMSS", batch: "S.Y 2021 - 2022", curriculum: "SHS Grade 12", status: "Released" },
        { lrn: "202110055", name: "Fernandez, Lucia M.", track: "BEC", batch: "S.Y 2022 - 2023", curriculum: "JHS Grade 10", status: "Processing" },
        { lrn: "202110056", name: "Navarro, Crisostomo I.", track: "SPA", batch: "S.Y 2023 - 2024", curriculum: "Senior High School", status: "Released" },
        { lrn: "202110048", name: "Bueno, Ryan Joshua E.", track: "TVL - IEM", batch: "S.Y 2020 - 2021", curriculum: "Senior High School", status: "Released" },
        { lrn: "202110049", name: "Dela Cruz, Juan", track: "HUMSS", batch: "S.Y 2021 - 2022", curriculum: "Senior High School", status: "Pending" },
        { lrn: "202110050", name: "Reyes, Maria Clara", track: "BEC", batch: "S.Y 2022 - 2023", curriculum: "JHS Grade 10", status: "Released" },
        { lrn: "202110051", name: "Santos, Pedro P.", track: "SPA", batch: "S.Y 2023 - 2024", curriculum: "SHS Grade 12", status: "Processing" },
        { lrn: "202110052", name: "Gonzales, Angela R.", track: "SPJ", batch: "S.Y 2024 - 2025", curriculum: "SHS Grade 11", status: "Released" },
        { lrn: "202110053", name: "Mendoza, Paul J.", track: "TVL", batch: "S.Y 2020 - 2021", curriculum: "Senior High School", status: "Pending" },
        { lrn: "202110054", name: "Torres, Miguel A.", track: "HUMSS", batch: "S.Y 2021 - 2022", curriculum: "SHS Grade 12", status: "Released" },
        { lrn: "202110055", name: "Fernandez, Lucia M.", track: "BEC", batch: "S.Y 2022 - 2023", curriculum: "JHS Grade 10", status: "Processing" },
        { lrn: "202110056", name: "Navarro, Crisostomo I.", track: "SPA", batch: "S.Y 2023 - 2024", curriculum: "Senior High School", status: "Released" },
      ],
      currentPage: 1,
      itemsPerPage: 20,
    };
  },

  
  computed: {
    filteredStudents() {
    return this.students.filter((student) => {
      return (
        (this.selectedBatch === "" || this.selectedBatch === "All" || student.batch === this.selectedBatch) &&
        (this.selectedCurriculum === "" || this.selectedCurriculum === "All" || student.curriculum === this.selectedCurriculum) &&
        (this.selectedTrack === "" || this.selectedTrack === "All" || student.track === this.selectedTrack) &&
        (!this.searchQuery ||
          student.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          student.lrn.includes(this.searchQuery))
        );
      });
    },
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    },

    paginatedStudents() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredStudents.slice(start, end);
    },
  },

  methods: {
    openaddModal() {
      this.$refs.addModalRef.openaddModal(); 
    },
    showUnReleasedModal() {
      this.$refs.unreleasedModalRef.showUnReleasedModal(); 
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


.filtering-section {
  display: flex;
  justify-content: space-between;
  margin: 0 0 20px 0;
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

.search-bar input {
  padding: 8px;
  border: 1px solid #295f98;
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
  overflow-y: auto;
  overflow-x: hidden; 
  max-height: 600px; 
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border: 1px solid #ddd;
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
  background: #295f98;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1;
}

tr {
  cursor: pointer;
}
tr:hover {
  background-color: #f6f6f6;
}

.status {
  min-width: 70px;
  display: inline-block;
}

.status.released {
  background: #0c5a48;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
}
.status.pending {
  background-color: #fbdf5a;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
}

.status.processing  {
  background-color: #b32113;
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

.page {
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
}

.pagination button.active {
  background-color: #295f98;
  color: white;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

</style>