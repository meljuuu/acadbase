<template>
  <div class="container">
    <Sidebar />
    <div class="nav-title">
      <h1>Transaction History Report</h1>
    </div>

    <div class="filtering-section">
      <div class="filters">
        <select v-model="selectedTrack" class="filter-dropdown">
          <option disabled value="">Academic Track</option>
          <option v-for="track in tracks" :key="track">{{ track }}</option>
        </select>

        <select v-model="selectedCurriculum" class="filter-dropdown">
          <option disabled value="">Curriculum</option>
          <option v-for="curriculum in curriculums" :key="curriculum">{{ curriculum }}</option>
        </select>

        <select v-model="selectedBatch" class="filter-dropdown">
          <option disabled value="">Year</option>
          <option v-for="batch in batches" :key="batch">{{ batch }}</option>
        </select>
      </div>

      

      <div class="search-bar">
        <input v-model="searchQuery" type="text" placeholder="Search students..." />
      </div>

      <div class="download-report">
        <select v-model="selectedFile" @change="handleDownload" class="filter-dropdown download-report">
          <option disabled value="">Download</option>
          <option value="pdf">PDF</option>
          <option value="csv">CSV</option>
        </select>
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
            <td>{{ student.processor }}</td>
            <td><span :class="['status', student.status.toLowerCase()]">{{ student.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="note">
      *Note: Only the most recent 200 students are displayed in the table.
      Students beyond 200 are available in the CSV file.*
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
import Sidebar from "@/components/Sidebar.vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
      selectedFile: "",
      searchQuery: "",
      batches: ["All", "2024", "2025", "2026"],
      curriculums: ["All", "JHS Grade 10", "SHS Grade 11", "SHS Grade 12"],
      tracks: ["All", "SPJ", "BEC", "SPA", "HUMSS", "TVL - IEM"],
      files: [".CSV", ".PDF"],
      students: [
        { lrn: "202110048", name: "Bueno, Ryan Joshua E.", track: "TVL", batch: "Batch 2020 - 2025", curriculum: "Senior High School", processor: "Galileo Galilei", status: "Released" },
        { lrn: "202110049", name: "Dela Cruz, Juan", track: "HUMSS", batch: "Batch 2023 - 2026", curriculum: "Senior High School", processor: "Isaac Newton", status: "Pending" },
        { lrn: "202110050", name: "Reyes, Maria Clara", track: "BEC", batch: "Batch 2022 - 2025", curriculum: "JHS Grade 10", processor: "Albert Einstein", status: "Released" },
        { lrn: "202110051", name: "Santos, Pedro P.", track: "SPA", batch: "Batch 2021 - 2024", curriculum: "SHS Grade 12", processor: "Nikola Tesla", status: "Processing" },
        { lrn: "202110052", name: "Gonzales, Angela R.", track: "SPJ", batch: "Batch 2024 - 2027", curriculum: "SHS Grade 11", processor: "Marie Curie", status: "Released" },
        { lrn: "202110053", name: "Mendoza, Paul J.", track: "TVL", batch: "Batch 2020 - 2025", curriculum: "Senior High School", processor: "Galileo Galilei", status: "Pending" },
        { lrn: "202110054", name: "Torres, Miguel A.", track: "HUMSS", batch: "Batch 2023 - 2026", curriculum: "SHS Grade 12", processor: "Isaac Newton", status: "Released" },
        { lrn: "202110055", name: "Fernandez, Lucia M.", track: "BEC", batch: "Batch 2022 - 2025", curriculum: "JHS Grade 10", processor: "Albert Einstein", status: "Processing" },
        { lrn: "202110056", name: "Navarro, Crisostomo I.", track: "SPA", batch: "Batch 2021 - 2024", curriculum: "Senior High School", processor: "Nikola Tesla", status: "Released" },
        { lrn: "202110057", name: "Luna, Antonio J.", track: "SPJ", batch: "Batch 2024 - 2027", curriculum: "SHS Grade 11", processor: "Marie Curie", status: "Pending" },
        { lrn: "202110058", name: "Rizal, Jose P.", track: "HUMSS", batch: "Batch 2022 - 2025", curriculum: "Senior High School", processor: "Galileo Galilei", status: "Released" },
        { lrn: "202110059", name: "Bonifacio, Andres", track: "TVL", batch: "Batch 2023 - 2026", curriculum: "SHS Grade 12", processor: "Isaac Newton", status: "Processing" },
        { lrn: "202110060", name: "Del Pilar, Marcelo", track: "SPA", batch: "Batch 2021 - 2024", curriculum: "JHS Grade 10", processor: "Albert Einstein", status: "Pending" },
        { lrn: "202110061", name: "Aguinaldo, Emilio", track: "SPJ", batch: "Batch 2024 - 2027", curriculum: "Senior High School", processor: "Nikola Tesla", status: "Released" },
        { lrn: "202110062", name: "Jacinto, Emilio", track: "BEC", batch: "Batch 2020 - 2025", curriculum: "SHS Grade 12", processor: "Marie Curie", status: "Pending" },
        { lrn: "202110063", name: "Mabini, Apolinario", track: "HUMSS", batch: "Batch 2023 - 2026", curriculum: "Senior High School", processor: "Galileo Galilei", status: "Processing" },
        { lrn: "202110064", name: "Silang, Gabriela", track: "TVL", batch: "Batch 2022 - 2025", curriculum: "JHS Grade 10", processor: "Isaac Newton", status: "Released" },
        { lrn: "202110065", name: "Lapu-Lapu, Datu", track: "SPA", batch: "Batch 2021 - 2024", curriculum: "SHS Grade 11", processor: "Albert Einstein", status: "Pending" },
        { lrn: "202110066", name: "Tandang Sora, Melchora", track: "SPJ", batch: "Batch 2024 - 2027", curriculum: "Senior High School", processor: "Nikola Tesla", status: "Released" },
        { lrn: "202110067", name: "Tandang Sora, Melody", track: "SPS", batch: "Batch 2024 - 2027", curriculum: "Senior High School", processor: "Nikola Tesla", status: "Released" },
      ],
      currentPage: 1,
      itemsPerPage: 20,
    };
  },

  computed: {
    filteredStudents() {
      return this.students.filter((student) => {
        const matchesSearch =
          !this.searchQuery ||
          student.lrn.includes(this.searchQuery) ||
          student.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          student.batch.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          student.curriculum.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          student.track.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          student.processor.toLowerCase().includes(this.searchQuery.toLowerCase());

        return (
          matchesSearch &&
          (!this.selectedTrack || this.selectedTrack === "All" || student.track === this.selectedTrack) &&
          (!this.selectedCurriculum || this.selectedCurriculum === "All" || student.curriculum === this.selectedCurriculum) &&
          (!this.selectedBatch || this.selectedBatch === "All" || student.batch.includes(this.selectedBatch))
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

    handleDownload() {
      if (this.selectedFile === "pdf") {
        this.downloadPDF();
      } else if (this.selectedFile === "csv") {
        this.downloadCSV();
      }
      this.selectedFile = "";
    },

    downloadCSV() {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "LRN,Student Name,S.Y. Batch,Curriculum,Track,Processor,Status\n"; // Headers

      this.filteredStudents.forEach((student) => {
        let row = `${student.lrn},${student.name},${student.batch},${student.curriculum},${student.track},${student.processor},${student.status}`;
        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "students_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    downloadPDF() {
      const doc = new jsPDF();
      doc.text("Student Report", 14, 10);

      const headers = [["LRN", "Student Name", "S.Y. Batch", "Curriculum", "Track", "Processor", "Status"]];
      const data = this.filteredStudents.map(student => [
        student.lrn, student.name, student.batch, student.curriculum, student.track, student.processor, student.status
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 20,
      });

      doc.save("students_report.pdf");
    }
  }
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

.filtering-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap; 
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
  max-height: 700px; 
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border: 1px solid #ddd; /* Optional: for better visibility */
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
