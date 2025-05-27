<template>
  <!-- Add Student Modal -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <div class="student-file-upload" @click="triggerFileInput">
        <label for="fileInput" class="upload-box">
          <p><i class="fas fa-upload"></i></p>
          <p v-if="!uploadedFile">Upload Student File (One PDF Only)</p>
          <p v-else>{{ uploadedFile.name }}</p>
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
          <object
            :data="pdfUrl"
            type="application/pdf"
            width="100%"
            height="500px"
          >
            <p>
              Your browser does not support PDFs.
              <a :href="pdfUrl" target="_blank">Download PDF</a>
            </p>
          </object>
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
          <input
            type="text"
            v-model="syBatch"
            placeholder="Enter S.Y Batch"
            @input="validateSyBatch"
            required
          />
        </div>

        <div class="input-group">
          <label>Curriculum</label>
          <input
            type="text"
            v-model="Curriculum"
            placeholder="Enter Curriculum"
            required
          />
        </div>
        <div class="input-group">
          <label>Academic Track</label>
          <input
            type="text"
            v-model="AcademicTrack"
            placeholder="Enter Academic Track"
            required
          />
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
          <object
            :data="pdfUrl"
            type="application/pdf"
            width="100%"
            height="500px"
          >
            <p>
              Your browser does not support PDFs.
              <a :href="pdfUrl" target="_blank">Download PDF</a>
            </p>
          </object>
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
            type="number"
            v-model="syBatch"
            placeholder=""
            @input="syBatch = syBatch < 0 ? '' : syBatch"
            onkeypress="return event.charCode >= 48 && event.charCode <= 57"
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
          <object
            :data="pdfUrl"
            type="application/pdf"
            width="100%"
            height="500px"
          >
            <p>
              Your browser does not support PDFs.
              <a :href="pdfUrl" target="_blank">Download PDF</a>
            </p>
          </object>
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
            type="number"
            v-model="syBatch"
            placeholder=""
            @input="syBatch = syBatch < 0 ? '' : syBatch"
            onkeypress="return event.charCode >= 48 && event.charCode <= 57"
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
    showUnReleasedModal() {
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
      this.DateAdded = new Date().toLocaleDateString();
      this.showModal = true;
    },
    closeModal() {
      this.removeFile();
      this.showModal = false;
    },
    async saveStudent() {
      try {
        const studentData = {
          Name: this.Name,
          lrn: this.lrn,
          birthdate: this.birthdate,
          syBatch: this.syBatch,
          Curriculum: this.Curriculum,
          AcademicTrack: this.AcademicTrack,
          FacultyName: this.FacultyName,
          DateAdded: this.DateAdded,
        };

        await MasterlistService.addStudent(studentData);
        this.closeModal();
        this.$emit("student-saved");
      } catch (error) {
        console.error("Error saving student:", error);
        alert("Failed to save student. Please try again.");
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
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === "text/csv") {
        this.uploadedFile = file;
        this.readCSV(file);
      } else {
        alert("Please upload a valid CSV file.");
        event.target.value = "";
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
      this.csvPreview = [];
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
</style>
