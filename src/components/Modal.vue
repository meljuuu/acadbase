<template>
  <!-- Add Student Modal -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <div class="student-file-upload" @click="triggerFileInput" :class="{ 'disabled-upload': !isStudentInfoComplete }">
        <label for="fileInput" class="upload-box">
          <p><i class="fas fa-upload"></i></p>
          <p v-if="!uploadedFile">Upload Student Files (PDFs Only)</p>
          <p v-else>{{ uploadedFile.name }} (1 of {{ $refs.fileInput?.files?.length || 1 }})</p>
        </label>
        <input
          type="file"
          id="fileInput"
          accept=".pdf"
          ref="fileInput"
          @change="handleFileUpload"
          hidden
          multiple
        />

        <div v-if="pdfUrl" class="pdf-preview">
          <embed
            :src="pdfUrl"
            @error="handlePdfError"
            type="application/pdf"
            width="100%"
            height="500px"
          />
          <p v-if="pdfLoadFailed">
            PDF failed to load. 
            <a :href="pdfUrl" target="_blank">Download instead</a>.
          </p>
          <button @click.stop="removeFile" class="remove-btn">Remove</button>
        </div>
      </div>

      <div class="student-processor-information">
        <h5>Student Information</h5>
        <div class="input-group">
          <label>Student Name</label>
          <input
            type="text"
            v-model="Name"
            placeholder="Enter Student Name"
            required
          />
        </div>
        <div class="input-group">
          <label>LRN</label>
          <input
            type="text"
            v-model="lrn"
            placeholder="Enter LRN"
            maxlength="12"
            @input="validateLRN"
            required
          />
        </div>
        <div class="input-group">
          <label>Birthdate</label>
          <input type="date" v-model="birthdate" required />
        </div>
        <div class="input-group">
          <label>S.Y Batch</label>
          <div style="display: flex; gap: 5px;">
            <select 
              v-model="syBatch" 
              @change="validateSyBatch"
              style="flex: 1;"
            >
              <option value="">Select Year</option>
              <option 
                v-for="year in academicYears" 
                :key="year" 
                :value="year"
              >
                {{ year }}
              </option>
            </select>
            <input
              type="text"
              v-model="syBatch"
              placeholder="YYYY-YYYY"
              @input="validateSyBatch"
              style="flex: 1;"
            />
          </div>
        </div>

        <div class="input-group">
          <label>Curriculum</label>
          <select v-model="Curriculum" required>
            <option value="">Select Curriculum</option>
            <option value="JHS">JHS</option>
            <option value="SHS">SHS</option>
          </select>
        </div>
        <div class="input-group">
          <label>Academic Track</label>
          <select v-model="AcademicTrack" required>
            <option value="">Select Track</option>
            <option value="SPJ">SPJ</option>
            <option value="BEC">BEC</option>
            <option value="SPA">SPA</option>
          </select>
        </div>
        <h5>Processor Information</h5>
        <div class="input-group">
          <label>Faculty Name</label>
          <input
            type="text"
            v-model="FacultyName"
            placeholder="Enter Faculty Name"
            readonly
          />
        </div>
        <div class="input-group">
          <label>Date of Added </label>
          <input type="text" v-model="DateAdded" placeholder="" readonly />
        </div>

        <div class="modal-buttons">
          <button @click="closeModal" class="cancel">Cancel</button>
          <button @click="saveStudent" class="add">Add Student</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ImportClassList Modal for CSV Upload -->
<div v-if="showImportModal" class="modal-overlay">
  <div class="modal-content">
    <!-- File Upload Box for CSV -->
    <div class="file-upload" @click="triggerFileInput">
      <label for="fileInput" class="upload-box">
        <p><i class="fas fa-upload"></i></p>
        <p v-if="!uploadedFile">Upload CSV File (CSV Only)</p>
        <p v-else>
          {{ uploadedFile.name }}
          <button @click.stop="removeFile" class="remove-btn">✕</button>
        </p>

      </label>
      <input
        type="file"
        id="fileInput"
        accept=".csv"
        ref="fileInput"
        @change="handleFileUpload"
        hidden
      />

      <!-- CSV Preview Section -->
      <div v-if="csvPreview.length">
        <h5>CSV Data Preview:</h5>
        <table class="csv-preview">
          <thead>
            <tr>
              <th>Name</th>
              <th>LRN</th>
              <th>Birthdate</th>
              <th>S.Y Batch</th>
              <th>Curriculum</th>
              <th>Academic Track</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in csvPreview" :key="index">
              <td>{{ student.Name }}</td>
              <td>{{ student.LRN }}</td>
              <td>{{ student.Birthdate }}</td>
              <td>{{ student.syBatch }}</td>
              <td>{{ student.Curriculum }}</td>
              <td>{{ student.AcademicTrack }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-buttons">
      <button @click="closeImportModal" class="cancel">Cancel</button>
      <button @click="uploadCSV" class="upload">Upload CSV</button>
    </div>
  </div>
</div>



<!-- Release Modal -->
  <div v-if="showreleasedModal" class="modal-overlay">
    <div class="modal-content">
      <div class="student-file-upload-released" @click="triggerFileInput">
      <label for="fileInput" class="upload-box">
        <p><i class="fas fa-upload"></i></p>
        <p v-if="!uploadedFile">Upload CSV File (CSV Only)</p>
        <p v-else>
          {{ uploadedFile.name }}
          <button @click.stop="removeFile" class="remove-btn">✕</button>
        </p>

      </label>
      <input
        type="file"
        id="fileInput"
        accept=".csv"
        ref="fileInput"
        @change="handleFileUpload"
        hidden
      />

        <div v-if="pdfUrl" class="pdf-preview">
          <embed
            :src="pdfUrl"
            @error="handlePdfError"
            type="application/pdf"
            width="100%"
            height="500px"
          />
          <p v-if="pdfLoadFailed">
            PDF failed to load. 
            <a :href="pdfUrl" target="_blank">Download instead</a>.
          </p>
          <button @click.stop="removeFile" class="remove-btn">Remove</button>
        </div>
      </div>

      <div class="student-processor-information">
        <h5>Student Information</h5>
        <div class="input-group">
          <label>Student Name</label>
          <input type="text" v-model="Name" placeholder="" readonly />
        </div>
        <div class="input-group">
          <label>LRN</label>
          <input
            type="text"
            v-model="lrn"
            placeholder=""
            maxlength="12"
            @input="validateLRN"
            readonly
          />
        </div>
        <div class="input-group">
          <label>Birthdate</label>
          <input type="date" v-model="birthdate" readonly />
        </div>
        <div class="input-group">
          <label>S.Y Batch</label>
          <input
            type="text"
            v-model="syBatch"
            placeholder="YYYY-YYYY"
            @input="validateSyBatch"
            readonly
          />
        </div>
        <div class="input-group">
          <label>Curriculum</label>
          <input type="text" v-model="Curriculum" placeholder="" readonly />
        </div>
        <div class="input-group">
          <label>Academic Track</label>
          <input type="text" v-model="AcademicTrack" placeholder="" readonly />
        </div>
        <h5>Processor Information</h5>
        <div class="input-group">
          <label>Faculty Name</label>
          <input type="text" v-model="FacultyName" placeholder="" readonly />
        </div>
        <div class="input-group">
          <label>Document Released</label>
          <input type="text" v-model="FacultyName" placeholder="" readonly />
        </div>
        <div class="input-group">
          <label>Date of Released</label>
          <input type="text" v-model="DateAdded" placeholder="" readonly />
        </div>

        <div class="modal-buttons">
          <button @click="closeReleasedModal" class="cancel">Back</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Processing Modal -->
  <div v-if="showunreleasedModal" class="modal-overlay">
    <div class="modal-content">
      <div class="student-file-upload-released" @click="triggerFileInput">
      <label for="fileInput" class="upload-box">
        <p><i class="fas fa-upload"></i></p>
        <p v-if="!uploadedFile">Upload PDF File (PDF Only)</p>
        <p v-else>
          {{ uploadedFile.name }}
          <button @click.stop="removeFile" class="remove-btn">✕</button>
        </p>

      </label>
      <input
        type="file"
        id="fileInput"
        accept=".pdf"
        ref="fileInput"
        @change="handleFileUpload"
        hidden
      />

        <div v-if="pdfUrl" class="pdf-preview">
          <embed
            :src="pdfUrl"
            @error="handlePdfError"
            type="application/pdf"
            width="100%"
            height="500px"
          />
          <p v-if="pdfLoadFailed">
            PDF failed to load. 
            <a :href="pdfUrl" target="_blank">Download instead</a>.
          </p>
          <button @click.stop="removeFile" class="remove-btn">Remove</button>
        </div>
      </div>

      <div class="student-processor-information">
        <h5>Student Information</h5>
        <div class="input-group">
          <label>Student Name</label>
          <input type="text" v-model="Name" placeholder="" readonly />
        </div>
        <div class="input-group">
          <label>LRN</label>
          <input
            type="text"
            v-model="lrn"
            placeholder=""
            maxlength="12"
            @input="validateLRN"
            readonly
          />
        </div>
        <div class="input-group">
          <label>Birthdate</label>
          <input type="date" v-model="birthdate" readonly />
        </div>
        <div class="input-group">
          <label>S.Y Batch</label>
          <input
            type="text"
            v-model="syBatch"
            placeholder="YYYY-YYYY"
            @input="validateSyBatch"
            readonly
          />
        </div>
        <div class="input-group">
          <label>Curriculum</label>
          <input type="text" v-model="Curriculum" placeholder="" readonly />
        </div>
        <div class="input-group">
          <label>Academic Track</label>
          <input type="text" v-model="AcademicTrack" placeholder="" readonly />
        </div>
        <h5>Processor Information</h5>
        <div class="input-group">
          <label>Faculty Name</label>
          <input type="text" v-model="FacultyName" placeholder="" readonly />
        </div>
        <div class="input-group">
          <label>Document Released</label>
          <input type="text" v-model="FacultyName" placeholder="" readonly />
        </div>
        <div class="input-group">
          <label>Date of Released</label>
          <input type="text" v-model="DateAdded" placeholder="" readonly />
        </div>
        <div class="furnished">
          <!-- Apply Copy Furnished Button -->
          <button
            class="apply-button"
            :style="{
              backgroundColor: isApplied ? '#fff' : '#0c5a48',
              color: isApplied ? '#0c5a48' : '#fff',
            }"
            @click="toggleApplyStatus"
          >
            <p>
              <font-awesome-icon v-if="isApplied" icon="check" class="mr-1" />
              {{
                isApplied ? "Copy Furnished Applied" : "Apply Copy Furnished"
              }}
            </p>
          </button>

          <!-- Copy Furnished Applied Button (Hidden initially, will be swapped dynamically) -->
          <button
            class="status-apply"
            :style="{
              backgroundColor: isApplied ? '#0c5a48' : '#fff',
              color: isApplied ? '#fff' : '#0c5a48',
            }"
            style="display: none"
            @click="toggleApplyStatus"
          >
            <p>
              <font-awesome-icon v-if="!isApplied" icon="check" class="mr-1" />
              {{
                isApplied ? "Apply Copy Furnished" : "Copy Furnished Applied"
              }}
            </p>
          </button>
        </div>

        <div class="modal-buttons">
          <button @click="closeUnReleasedModal" class="cancel">Back</button>
          <button class="released-button">Released Documents</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MasterlistService from '../service/MasterlistService';

// Define API_BASE_URL (use the same value as in MasterlistService.js)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const PDF_BASE_URL = import.meta.env.VITE_API_PDF || `${API_BASE_URL}/storage`;

export default {
  name: "Modal",
  data() {
    return {
      showModal: false,
      showreleasedModal: false,
      showunreleasedModal: false,
      showImportModal: false,
      uploadedFile: null,
      csvPreview: [],
      pdfUrl: null,
      Name: "",
      lrn: "",
      birthdate: "",
      syBatch: "",
      Curriculum: "",
      AcademicTrack: "",
      FacultyName: this.getFacultyName(),
      DateAdded: new Date().toLocaleDateString(),
      isApplied: false,
      isPdfLoaded: false,
      pdfLoadFailed: false,
      academicYears: [
  "2025-2026", // Current year (auto-populated)
  "2024-2025", // Previous year
  "2023-2024",
  "2022-2023",
  "2021-2022",
  "2020-2021",
  "2019-2020",
]

    };
  },
  props: {
    studentData: {
      type: Object,
      default: () => ({
        Name: "",
        lrn: "",
        AcademicTrack: "",
        // ... other fields ...
      }),
    },
  },
  methods: {
    getFacultyName() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return "";

      const { FirstName, MiddleName, LastName } = user;
      let fullName = FirstName || "";
      if (MiddleName) fullName += ` ${MiddleName}`;
      if (LastName) fullName += ` ${LastName}`;

      return fullName.trim();
    },
    async fetchStudentData(id) {
      if (!id) {
        console.error("Invalid student ID:", id);
        alert("Invalid student ID. Please try again.");
        return;
      }

      try {
        const student = await MasterlistService.getStudent(id);
        this.Name = student.name;
        this.lrn = student.lrn;
        this.birthdate = student.birthdate || '';
        this.syBatch = student.batch;
        this.Curriculum = student.curriculum;
        this.AcademicTrack = student.track;
        this.FacultyName = student.faculty_name;
        this.DateAdded = student.created_at || new Date().toLocaleDateString();

        // Fix PDF URL construction
        if (student.pdf_storage) {
          let pdfPath = student.pdf_storage.replace('public/', '');
          if (!pdfPath.endsWith('.pdf')) pdfPath += '.pdf';
          
          this.pdfUrl = `${PDF_BASE_URL}/${pdfPath}`;
          console.log("Constructed PDF URL:", this.pdfUrl);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    showUnReleasedModal(id) {
      this.fetchStudentData(id); // Fetch data when modal is opened
      this.showunreleasedModal = true;
    },
    closeUnReleasedModal() {
      this.showunreleasedModal = false;
    },
    showReleasedModal() {
      this.showreleasedModal = true;
    },
    closeReleasedModal() {
      this.showreleasedModal = false;
    },
    openaddModal() {
      this.syBatch = this.currentAcademicYear; // Auto-populate with current year
      this.showModal = true;
    },
    closeModal() {
      this.removeFile();
      this.showModal = false;
    },
    async saveStudent() {
      if (!this.Name || !this.lrn || !this.AcademicTrack || !this.syBatch || !this.Curriculum) {
        alert('Please fill all required student information fields.');
        return;
      }

      if (this.uploadedFile && this.uploadedFile.size > 10 * 1024 * 1024) {
        alert('PDF file size must not exceed 10MB.');
        return;
      }

      try {
        const studentData = {
          lrn: this.lrn,
          name: this.Name,
          track: this.AcademicTrack,
          batch: this.syBatch,
          curriculum: this.Curriculum,
          status: this.uploadedFile ? 'Unreleased' : 'Not-Applicable',
          faculty_name: this.FacultyName,
          birthdate: this.birthdate,
          ...(this.uploadedFile && { pdfFile: this.uploadedFile }),
        };

        console.log('Submitting student data:', studentData);
        await MasterlistService.addStudent(studentData);
        this.closeModal();
        this.$emit("student-saved");
      } catch (error) {
        console.error("Error saving student:", error.response?.data || error.message);
        alert(`Failed to save student: ${error.response?.data?.message || error.message}`);
      }
    },

    openImportModal() {
      this.showImportModal = true;  // Show the modal when this method is called
    },
    closeImportModal() {
      this.showImportModal = false;  // Close the modal
      this.removeFile();  // Optionally remove file when modal is closed
    },
    triggerFileInput() {
      if (!this.isStudentInfoComplete) {
        return; // Prevent opening the file dialog
      }
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        const pdfFiles = Array.from(files).filter(file => file.type === "application/pdf");
        if (pdfFiles.length > 0) {
          this.uploadedFile = pdfFiles[0]; // For simplicity, we'll use the first file
          this.pdfUrl = URL.createObjectURL(pdfFiles[0]);
        } else {
          event.target.value = ""; // Clear the file input
        }
      }
    },
    readCSV(file) {
      const reader = new FileReader();
      reader.onload = () => {
        const contents = reader.result;
        const parsedData = this.parseCSV(contents);
        this.csvPreview = parsedData;
      };
      reader.readAsText(file);
    },
    parseCSV(csvContent) {
      const lines = csvContent.split("\n");
      const result = [];
      const headers = lines[0].split(",");

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(",");
        if (currentLine.length === headers.length) {
          let student = {};
          for (let j = 0; j < headers.length; j++) {
            student[headers[j].trim()] = currentLine[j].trim();
          }
          result.push(student);
        }
      }
      return result;
    },
    removeFile() {
      this.uploadedFile = null;
      this.pdfUrl = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    uploadCSV() {
      if (this.csvPreview.length) {
        console.log("Uploading CSV data:", this.csvPreview);
        this.closeImportModal();
      } else {
        alert("Please upload a CSV file.");
      }
    },
    toggleApplyStatus() {
      this.isApplied = !this.isApplied;

      const applyButton = document.querySelector(".apply-button");
      const statusButton = document.querySelector(".status-apply");

      applyButton.style.display = this.isApplied ? "none" : "block";
      statusButton.style.display = this.isApplied ? "block" : "none";
    },
    validateLRN(event) {
      // Remove any non-numeric characters
      this.lrn = this.lrn.replace(/[^0-9]/g, '');
    },
    validateSyBatch() {
      // Format: YYYY-YYYY
      let value = this.syBatch.replace(/[^0-9-]/g, '');
      
      // Ensure proper format
      if (value.length > 9) {
        value = value.slice(0, 9);
      }
      
      // Add hyphen after 4 digits if not present
      if (value.length > 4 && !value.includes('-')) {
        value = value.slice(0, 4) + '-' + value.slice(4);
      }
      
      this.syBatch = value;
    },
    checkPdfSupport() {
      // Simple check for PDF support (modern browsers support PDF embedding)
      this.isPdfLoaded = !!document.createElement('embed').type;
    },
    handlePdfError() {
      this.pdfLoadFailed = true;
    },
  },
  computed: {
    isStudentInfoComplete() {
      return this.Name && this.lrn && this.AcademicTrack && this.syBatch && this.Curriculum;
    },
    currentAcademicYear() {
      const currentYear = new Date().getFullYear();
      return `${currentYear}-${currentYear + 1}`;
    },
  },
  mounted() {
    this.checkPdfSupport();
    console.log('Environment Variables:', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_API_PDF: import.meta.env.VITE_API_PDF,
      ALL_ENV: import.meta.env
    });
  },
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  margin-top: 50px;
  display: flex;
  background: white;
  padding: 20px 0;
  border-radius: 10px;
  width: 750px;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.modal-content h5 {
  text-align: center;
  color: #295f98;
  margin-bottom: 10px;
  margin-top: 5px;
}
.student-file-upload {
  background-color: #ebf1fa;
  width: 50%;
  height: 575px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 5px;
  padding: 20px;
  cursor: pointer;
  border: 2px dashed #295f98;
}
.student-file-upload-released {
  background-color: #ebf1fa;
  width: 50%;
  height: 620px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 5px;
  padding: 20px;
  cursor: pointer;
  border: 2px dashed #295f98;
}
.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  padding: 20px;
}

.upload-box p i {
  font-size: 16px;
  margin-bottom: 10px;
}
.pdf-preview {
  margin-top: 10px;
  padding: 5px;
  border-radius: 5px;
}
.student-file-upload p {
  margin: 0;
  padding: 0;
}
.modal-content label {
  font-size: 10px;
  text-align: left;
  color: #295f98;
  font-weight: bold;
  margin-bottom: -50px;
}

.modal-content input {
  width: 95%;
  padding: 8px;
  margin-top: -1px;
  margin-bottom: 5px;
  border: 1px solid #295f98;
  outline: none;
  border-radius: 5px;
}

.modal-content input::placeholder {
  font-size: 11px;
  color: #295f98;
}

.modal-content input:focus {
  border-color: #295f9852;
  box-shadow: 0 0 3px rgba(41, 95, 152, 0.5);
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.modal-buttons button.released-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  background-color: #0c5a48;
  color: white;
}

.modal-buttons button.cancel {
  background: #8b8b8b;
  color: #fff;
}
.modal-buttons button.add {
  background: #295f98;
  color: #fff;
}
.remove-btn {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}
.furnished {
  display: flex;
  font-size: 8px;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
}
.apply-button {
  padding: 0px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 75%;
  border: 1px solid #0c5a48;
}
.status-apply {
  padding: 0px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 75%;
  border: 1px solid #0c5a48;
}
.remove-btn {
  background: none;
  border: none;
  color: red;
  margin-left: 10px;
  cursor: pointer;
  font-size: 1rem;
}
.student-file-upload.disabled-upload {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none; 
}
select {
  width: 95%;
  padding: 8px;
  margin-top: -1px;
  margin-bottom: 5px;
  border: 1px solid #295f98;
  outline: none;
  border-radius: 5px;
  background-color: white;
}

select:focus {
  border-color: #295f9852;
  box-shadow: 0 0 3px rgba(41, 95, 152, 0.5);
}

.pdf-embed {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pdf-fallback {
  color: #d32f2f;
  margin-top: 10px;
}

.pdf-download {
  color: #295f98;
  text-decoration: underline;
}
</style>
