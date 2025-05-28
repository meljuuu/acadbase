<template>
  <div class="container">
    <div class="nav-title">
      <h1>Master List</h1>
    </div>

    <div class="filtering-section">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search..." />

        <Buttons @click="openaddModal" />

        <ImportClassListButton @click="openImportModal" />



        <Modal ref="addModalRef" />

        <Modal ref="importModalRef">
          <template #default>
            <div class="import-container">
              <input 
                type="file" 
                accept=".csv" 
                @change="handleCsvUpload" 
                class="file-input"
              />
              <div class="import-instructions">
                <h3>CSV File Requirements:</h3>
                <ul>
                  <li>File must be in CSV format</li>
                  <li>Required columns: LRN, Name, Track, Curriculum</li>
                  <li>Optional columns: Batch or School Year (case-sensitive)</li>
                  <li>Status will be set to "Unreleased" automatically</li>
                </ul>
              </div>
              <button @click="processCsv" class="process-button">Process CSV</button>
            </div>
          </template>
        </Modal>
      </div>

      <div class="filters">
        <Dropdown
          :showStatus="true"
          :hideAllOption="true"
          @update:selectedStatus="selectedStatus = $event"
        />
        <Dropdown
          :showBatch="true"
          :hideAllOption="true"
          @update:selectedBatch="selectedBatch = $event"
        />
        <Dropdown
          :showCurriculum="true"
          :hideAllOption="true"
          @update:selectedCurriculum="selectedCurriculum = $event"
        />
        <Dropdown
          :showTrack="true"
          @update:selectedTrack="selectedTrack = $event"
        />
      </div>

      <button class="reset-button" @click="resetFilters" title="Reset Filters">
          <i class="fas fa-sync-alt"></i>
        </button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>LRN</th>
            <th>STUDENT NAME</th>
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
            <td>{{ student.lrn }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.track }}</td>
            <td>{{ student.curriculum }}</td>
            <td>{{ student.batch }}</td>
            <td>
              <span :class="['status', student.status.toLowerCase()]">{{
                student.status
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal ref="unreleasedModalRef" />
    <EditModal ref="editModalRef" />

    <p class="note">
      *Note: Only 20 students are displayed in the table. Other students Name
      are on the next page.*
    </p>

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
      error: null
    };
  },
  computed: {
    filteredStudents() {
      return this.students;
    },
    totalPages() {
      if (this.itemsPerPage <= 0 || this.total <= 0) {
        return 1; // Fallback to 1 page if invalid values
      }
      return Math.ceil(this.total / this.itemsPerPage);
    },
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
    }
  },
  methods: {
    async fetchStudents() {
      this.loading = true;
      this.error = null;
      try {
        const filters = {
          batch: this.selectedBatch,
          curriculum: this.selectedCurriculum,
          track: this.selectedTrack,
          status: this.selectedStatus,
          search: this.searchQuery,
          page: this.currentPage
        };
        
        console.log('Fetching with filters:', filters);
        const response = await MasterlistService.filterStudents(filters);
        console.log('API Response:', response);
        
        if (!response?.data) {
          throw new Error('Invalid response structure from API');
        }
        
        this.students = response.data;
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
      this.selectedStatus = "";
      this.selectedBatch = "";
      this.selectedCurriculum = "";
      this.selectedTrack = "";
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
  flex-direction: row;
  align-items: center;
  gap: 10px;
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
  width: 100px;
  display: inline-block;
}

.status.released {
  background: #0c5a48;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
}
.status.unreleased {
  background-color: #fbdf5a;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
}

.status.dropped-out {
  background-color: #b32113;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
}

.status.not-applicable {
  background-color: #7e7a79;
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
  padding: 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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
</style>
