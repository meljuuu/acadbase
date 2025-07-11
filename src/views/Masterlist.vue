<template>
  <div class="container">
    <div class="nav-title">
      <h1>Master List</h1>
    </div>

    <div class="filtering-section">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search..." />

        <Buttons @click="openaddModal" />

        <ImportClassListButton @open-modal="openImportModal" />



        <Modal ref="addModalRef" />

        <Modal ref="importModalRef" @csvUploaded="fetchStudents" />
      </div>

      <div class="filters">
        <Dropdown
          :showStatus="true"
          :hideAllOption="true"
          v-model:selectedStatus="selectedStatus"
        />
        <!-- Reset button moved here, right after status filter -->
        <button class="reset-button" @click="resetFilters" title="Reset Filters">
          <i class="fas fa-sync-alt" style="margin-right: 6px;"></i>
          Reset
        </button>
        <Dropdown
          :showBatch="true"
          :hideAllOption="true"
          v-model:selectedBatch="selectedBatch"
        />
        <Dropdown
          :showCurriculum="true"
          :hideAllOption="true"
          v-model:selectedCurriculum="selectedCurriculum"
        />
        <!-- School year dropdown removed -->
      </div>

      <div class="filter-actions">
        <!-- Only the download button remains here, at the end -->
        <button
          class="download-btn"
          @click.stop="downloadExcel"
          title="Download as Excel"
          style="display: flex; align-items: center; gap: 4px;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 10V3H7v7H4l6 6 6-6h-3z"/>
            <path d="M5 18h10v-2H5v2z"/>
          </svg>
          Download
        </button>
      </div>
    </div>

    

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="text-align: center; vertical-align: middle;">
              <!-- Changed from download button to # -->
              #
            </th>
            <th>LRN</th>
            <th>STUDENT NAME</th>
            <th>GENDER</th>
            <th>ACADEMIC TRACK</th>
            <th>CURRICULUM</th>
            <th>SCHOOL YEAR</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, index) in students"
            :key="student.id"
            @click="showUnReleasedModal(student.id)"
          >
            <td style="text-align: center;">{{ index + 1 }}</td>
            <td>{{ student.lrn || '-' }}</td>
            <td>{{ student.name || '-' }}</td>
            <td>{{ student.gender || '-' }}</td>
            <td>{{ student.track || '-' }}</td>
            <td>{{ student.curriculum || '-' }}</td>
            <td>{{ student.batch || '-' }}</td>
            <td>
              <span :class="['status', formatStatusClass(student.status || 'Not-Applicable')]">
                {{ formattedStatus(student.status || 'Not-Applicable') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal ref="unreleasedModalRef" />
    <EditModal ref="editModalRef" />

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        ← Previous
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next →
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchStudents">Retry</button>
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown.vue";
import Buttons from "@/components/Buttons.vue";
import Modal from "@/components/Modal.vue";
import ImportClassListButton from "../components/ImportClassListButton.vue";
import EditModal from "@/components/EditModal.vue";
import MasterlistService from "@/service/MasterlistService";
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default {
  name: "Masterlist",
  components: {
    Dropdown,
    Buttons,
    ImportClassListButton,
    Modal,
    EditModal,
  },
  data() {
    return {
      selectedStatus: "",
      selectedBatch: "",
      selectedCurriculum: "",
      selectedTrack: "",
      searchQuery: "",
      uploadedFile: null,
      pdfUrl: "",
      activeDropdown: null,
      currentPage: 1,
      itemsPerPage: 20,
      students: [],
      total: 0,
      loading: false,
      error: null,
      yearOptions: ['2021 - 2022', '2022 - 2023', '2023 - 2024'],
      selectedYear: '',
    };
  },
  computed: {
    filteredStudents() {
      return this.students.map(student => ({
        ...student,
        lrn: student.lrn || '-',
        name: student.name || '-',
        track: student.track || '-',
        curriculum: student.curriculum || '-',
        batch: student.batch || '-',
        status: student.status || 'Not-Applicable'
      }));
    },
    totalPages() {
      if (this.itemsPerPage <= 0 || this.total <= 0) {
        return 1; // Fallback to 1 page if invalid values
      }
      return Math.ceil(this.total / this.itemsPerPage);
    },
    formattedStatus() {
      return (status) => {
        if (!status) return 'Not Applicable';
        
        // Convert camelCase or snake_case to Title Case with spaces
        return status
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
          .trim(); // Remove leading/trailing spaces
      };
    }
  },
  watch: {
    selectedStatus() {
      this.fetchStudents();
    },
    selectedBatch() {
      this.fetchStudents();
    },
    selectedCurriculum() {
      this.fetchStudents();
    },
    selectedTrack() {
      this.fetchStudents();
    },
    searchQuery() {
      this.fetchStudents();
    },
    selectedYear(newYear) {
      // filter your data here
    }
  },
  methods: {
    async fetchStudents() {
      this.loading = true;
      this.error = null;
      try {
        const filters = {
          batch: this.selectedBatch && this.selectedBatch !== "All" ? this.selectedBatch : null,
          curriculum: this.selectedCurriculum && this.selectedCurriculum !== "All" ? this.selectedCurriculum : null,
          track: this.selectedTrack && this.selectedTrack !== "All" ? this.selectedTrack : null,
          status: this.selectedStatus && this.selectedStatus !== "All" ? this.selectedStatus : null,
          search: this.searchQuery || null,
          page: this.currentPage
        };
        
        console.log('Fetching with filters:', filters);
        const response = await MasterlistService.filterStudents(filters);
        console.log('API Response:', response);
        
        if (!response?.data) {
          throw new Error('Invalid response structure from API');
        }
        
        // Process the data to handle null values
        this.students = response.data.map(student => ({
          ...student,
          lrn: student.lrn || null,
          name: student.name || null,
          track: student.track || null,
          curriculum: student.curriculum || null,
          batch: student.batch || null,
          status: student.status || 'Not-Applicable'
        }));
        
        this.currentPage = response.current_page || 1;
        this.total = response.total || 0;
        this.itemsPerPage = response.per_page || 20;
        
        // Force update if needed
        this.$nextTick(() => this.$forceUpdate());
        
      } catch (error) {
        console.error('Detailed fetch error:', {
          message: error.message,
          stack: error.stack,
          response: error.response
        });
        this.error = `Failed to load data: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },

    async addStudent(studentData) {
      try {
        await MasterlistService.addStudent(studentData);
        await this.fetchStudents();
      } catch (error) {
        this.error = 'Error adding student: ' + error.message;
        console.error('Error:', error);
      }
    },

    async updateStudent(id, studentData) {
      try {
        await MasterlistService.updateStudent(id, studentData);
        await this.fetchStudents();
      } catch (error) {
        this.error = 'Error updating student: ' + error.message;
        console.error('Error:', error);
      }
    },

    async deleteStudent(id) {
      try {
        await MasterlistService.deleteStudent(id);
        await this.fetchStudents();
      } catch (error) {
        this.error = 'Error deleting student: ' + error.message;
        console.error('Error:', error);
      }
    },

    openImportModal() {
      this.$refs.importModalRef.openImportModal();
    },
    openaddModal() {
      this.$refs.addModalRef.openaddModal();
    },
    showUnReleasedModal(id) {
      this.$refs.unreleasedModalRef.showUnReleasedModal(id);
    },
    toggleDropdown(index) {
      this.activeDropdown = this.activeDropdown === index ? null : index;
    },
    openEditModal(id) {
      this.activeDropdown = null; // close dropdown
      this.$refs.editModalRef.showunreleasedModal = true; // assuming your EditModal uses this flag
      this.$refs.editModalRef.studentId = id;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchStudents();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchStudents();
      }
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.activeDropdown = null;
      }
    },
    resetFilters() {
      this.selectedStatus = null;
      this.selectedBatch = null;
      this.selectedCurriculum = null;
      this.selectedTrack = null;
      this.searchQuery = "";
      this.currentPage = 1;
      this.fetchStudents();
    },
    async handleCsvUpload(event) {
      console.log('Uploaded file:', event.target.files[0]); // Debug
      this.uploadedFile = event.target.files[0];
    },
    async processCsv() {
      console.log('processCsv called'); // Debug
      if (!this.uploadedFile) {
        console.error('No file uploaded'); // Debug
        this.error = 'No CSV file uploaded.';
        return;
      }

      try {
        console.log('Processing CSV file:', this.uploadedFile.name); // Debug log
        const response = await MasterlistService.processCsvAndAddStudents(this.uploadedFile);
        console.log('CSV processed successfully:', response); // Debug log
        await this.fetchStudents(); // Refresh the list
        this.$refs.importModalRef.closeModal(); // Close the modal on success
        this.error = null; // Clear any previous errors
      } catch (error) {
        console.error('CSV processing error:', error); // Debug log
        this.error = error.message;
      }
    },
    parsePdfText(text) {
      // Example parsing logic (adjust based on your PDF's structure)
      const lrnMatch = text.match(/LRN[:.]?\s*(\d+)/i);
      const nameMatch = text.match(/Name[:.]?\s*([^\n]+)/i);
      const trackMatch = text.match(/Track[:.]?\s*([^\n]+)/i);
      const curriculumMatch = text.match(/Curriculum[:.]?\s*([^\n]+)/i);
      const yearMatch = text.match(/School Year[:.]?\s*([^\n]+)/i);

      if (!lrnMatch || !nameMatch) {
        this.error = 'Required fields (LRN or Name) not found in PDF.';
        return null;
      }

      return {
        lrn: lrnMatch ? lrnMatch[1].trim() : '',
        name: nameMatch ? nameMatch[1].trim() : '',
        track: trackMatch ? trackMatch[1].trim() : '',
        curriculum: curriculumMatch ? curriculumMatch[1].trim() : '',
        batch: yearMatch ? yearMatch[1].trim() : '',
      };
    },
    formatStatusClass(status) {
      if (!status) return 'not-applicable';
      // Convert status to lowercase and replace spaces with hyphens
      return status.toLowerCase().replace(/\s+/g, '-');
    },
    downloadExcel() {
      // Prepare data for Excel
      const data = this.students.map((student, index) => ({
        "#": index + 1,
        "LRN": student.lrn || "-",
        "STUDENT NAME": student.name || "-",
        "GENDER": student.gender || "-",
        "ACADEMIC TRACK": student.track || "-",
        "CURRICULUM": student.curriculum || "-",
        "SCHOOL YEAR": student.batch || "-",
        "STATUS": this.formattedStatus(student.status || "Not-Applicable"),
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Masterlist");

      // Generate buffer and trigger download
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), "masterlist.xlsx");
    },
    onCurriculumChange(curriculum) {
      this.selectedCurriculum = curriculum;
      this.fetchStudents();
    }
  },
  mounted() {
    console.log('Component mounted, fetching students');
    this.fetchStudents();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    console.log('Component unmounting');
    document.removeEventListener("click", this.handleClickOutside);
  },
  errorCaptured(err, vm, info) {
    console.error('Error captured:', err, info);
    this.error = 'An unexpected error occurred';
    // Prevent the error from propagating further
    return false;
  },
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
  align-items: center;
  gap: 20px; /* Adjust as needed */
  justify-content: space-between; /* Or use space-evenly for equal spacing */
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  margin-bottom: 20px;
  position: sticky;
  top: 70px;
  z-index: 1;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
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
  align-items: center;
  flex-shrink: 0;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #295f98;
  border-radius: 5px;
  width: 250px;
}

.add-student {
  background: #295f98;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border: 1px solid #ddd;
  width: 100%;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}

th {
  padding-top: 20px;
  background: #295f98;
  color: white;
  position: sticky;
  top: 0;
  z-index: 0;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
.action-button {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  background-color: #295f98;
  color: #ffffff;
  padding: 0;
}
.action-button:hover {
  color: #1a3f66;
}
.action-wrapper {
  position: relative;
}

.action-button {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  background-color: #295f98;
  color: #ffffff;
  padding: 0;
  border-radius: 3px;
}

.action-button i{
  padding: 10px;
}

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

.reset-button {
  background: #295f98;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 38px;
  font-weight: bold;
}

.reset-button:hover {
  background: #1a3f66;
}

.import-container {
  padding: 20px;
  text-align: center;
}

.file-input {
  margin-bottom: 20px;
}

.import-instructions {
  text-align: left;
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.import-instructions h3 {
  color: #295f98;
  margin-bottom: 10px;
}

.import-instructions ul {
  list-style-type: disc;
  padding-left: 20px;
}

.process-button {
  background: #295f98;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.process-button:hover {
  background: #1f4b79;
}

/* Add a style for - text */
td {
  color: #666;
}

td:empty::before {
  content: '-';
  color: #999;
  font-style: italic;
}
.download-btn {
  background: #1d6f42;
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}
.download-btn:hover {
  background: #218838;
}

/* Add a wrapper for the buttons at the end for better alignment */
.filter-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
