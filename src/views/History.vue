<template>
  <div class="container">
    <div class="nav-title">
      <h1>Transaction History Report</h1>
    </div>

    <div class="filtering-section">
      <div class="filters">
        <Dropdown
          :showBatch="true"
          @update:selectedBatch="selectedBatch = $event"
        />
        <Dropdown
          :showCurriculum="true"
          @update:selectedCurriculum="selectedCurriculum = $event"
        />
        <Dropdown
          :showTrack="true"
          @update:selectedTrack="selectedTrack = $event"
        />
        
      </div>

      <div class="filter-actions">
        <button class="download-button" @click="downloadCSV" title="Download CSV">
          <i class="fas fa-download"></i> Download CSV
        </button>
        <button class="reset-button" @click="resetFilters" title="Reset Filters">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>LRN</th>
            <th>STUDENT NAME</th>
            <th>S.Y. BATCH</th>
            <th>CURRICULUM</th>
            <th>ACADEMIC TRACK</th>
            <th>PROCESSOR</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in paginatedStudents" :key="index">
            <td>{{ student.lrn }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.batch }}</td>
            <td>{{ student.curriculum }}</td>
            <td>{{ student.track }}</td>
            <td>{{ student.faculty_name }}</td>
            <td>
              <span :class="['status', formatStatusClass(student.status)]">
                {{ student.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="note">
      *Note: Only the most recent 200 students are displayed in the table.
      Students beyond 200 are available in the CSV file.*
    </p>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        ← Previous
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next →
      </button>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Dropdown from "@/components/Dropdown.vue";
import MasterlistService from "@/service/MasterlistService";

export default {
  name: "History",
  components: {
    Sidebar,
    Dropdown,
  },
  data() {
    return {
      selectedBatch: "",
      selectedCurriculum: "",
      selectedTrack: "",
      selectedType: "",
      students: [],
      currentPage: 1,
      itemsPerPage: 20,
      totalItems: 0,
      loading: false,
      error: null
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    paginatedStudents() {
      return this.students;
    }
  },
  watch: {
    // Add watchers for all filter changes
    selectedBatch() {
      this.handleFilterChange();
    },
    selectedCurriculum() {
      this.handleFilterChange();
    },
    selectedTrack() {
      this.handleFilterChange();
    },
    selectedType() {
      if (this.selectedType === '.csv') {
        this.downloadCSV();
      }
    }
  },
  methods: {
    async fetchStudents() {
      try {
        this.loading = true;
        const filters = {
          batch: this.selectedBatch,
          curriculum: this.selectedCurriculum,
          track: this.selectedTrack,
          status: this.selectedType,
          page: this.currentPage
        };

        const response = await MasterlistService.filterStudents(filters);
        this.students = response.data;
        this.totalItems = response.total;
        this.currentPage = response.current_page;
      } catch (error) {
        console.error('Error fetching students:', error);
        this.error = 'Failed to fetch students. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    handleFilterChange() {
      this.currentPage = 1; // Reset to first page when filters change
      this.fetchStudents();
    },
    resetFilters() {
      // Reset all filters
      this.selectedBatch = "";
      this.selectedCurriculum = "";
      this.selectedTrack = "";
      this.selectedType = "";
      this.currentPage = 1;
      this.fetchStudents();
    },
    async changePage(page) {
      this.currentPage = page;
      await this.fetchStudents();
    },
    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchStudents();
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchStudents();
      }
    },
    formatStatusClass(status) {
      if (!status) return '';
      // Convert status to lowercase and replace spaces with hyphens
      return status.toLowerCase().replace(/\s+/g, '-');
    },
    async downloadCSV() {
      try {
        // Get the current filtered data from the table
        const students = this.paginatedStudents;

        if (!students || students.length === 0) {
          this.error = 'No data available to download';
          return;
        }

        // Helper function to escape CSV values
        const escapeCSV = (value) => {
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        };

        // Create CSV content with proper escaping
        const headers = ['LRN', 'STUDENT NAME', 'S.Y. BATCH', 'CURRICULUM', 'ACADEMIC TRACK', 'PROCESSOR', 'STATUS'];
        const csvContent = [
          headers.map(escapeCSV).join(','),
          ...students.map(student => [
            escapeCSV(student.lrn),
            escapeCSV(student.name),
            escapeCSV(student.batch),
            escapeCSV(student.curriculum),
            escapeCSV(student.track),
            escapeCSV(student.faculty_name),
            escapeCSV(student.status)
          ].join(','))
        ].join('\n');

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `student_records_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

      } catch (error) {
        console.error('Error downloading CSV:', error);
        this.error = 'Failed to download CSV. Please try again.';
      }
    }
  },
  mounted() {
    this.fetchStudents();
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
  height: 100vh;
  overflow: hidden;
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
  background-color: #ffffff;
  padding: 30px 20px;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 10px;
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.reset-button {
  background: #295f98;
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: background-color 0.3s ease;
}

.reset-button:hover {
  background: #1a3f66;
}

.reset-button i {
  font-size: 14px;
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
  flex-grow: 1;
  max-width: 250px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 15px 45px 15px 20px; /* Adjust padding to prevent overlap */
  border: 1px solid #295f98;
  border-radius: 5px;
  font-size: 14px;
  background: #fff;
  font-weight: bold;
  color: #295f98;
  transition: all 0.3s ease-in-out;
}

.search-bar input::placeholder {
  color: #295f98;
  opacity: 0.7;
}

.search-bar input:focus {
  outline: none;
  border-color: #1f4a7a;
  box-shadow: 0 0 5px rgba(41, 95, 152, 0.5);
}

.search-bar::after {
  content: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' fill='%23295f98'><path d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.02 14 5 11.98 5 9.5S7.02 5 9.5 5 14 7.02 14 9.5 11.98 14 9.5 14z'/></svg>");
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.donwload-report {
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
  border-bottom: 1px solid #dddddd;
  font-size: 12px;
}

th {
  padding-top: 20px;
  background: #295f98;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
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
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

/* Released status - Green */
.status.released {
  background-color: #0c5a48;
  color: white;
}

/* Unreleased status - Yellow */
.status.unreleased {
  background-color: #fbdf5a;
  color: #000;
}

/* Not-Applicable status - Gray */
.status.not-applicable {
  background-color: #7e7a79;
  color: white;
}

/* Dropped-Out status - Red */
.status.dropped-out {
  background-color: #dc3545;
  color: white;
}

/* Review status - Orange */
.status.review {
  background-color: #fd7e14;
  color: white;
}

/* Revised status - Purple */
.status.revised {
  background-color: #6f42c1;
  color: white;
}

/* Add hover effect for better UX */
.status:hover {
  opacity: 0.9;
  transform: scale(1.05);
  transition: all 0.2s ease-in-out;
}

/* Add a subtle shadow to make status badges pop */
.status {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* Add loading state styles */
.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Add error message styles */
.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message button {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.error-message button:hover {
  background: #b71c1c;
}

.download-button {
  background: #295f98;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
}

.download-button:hover {
  background: #1a3f66;
}

.download-button i {
  font-size: 14px;
}
</style>
