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
            type="number"
            v-model="syBatch"
            placeholder="Enter S.Y Batch"
            @input="syBatch = syBatch < 0 ? '' : syBatch"
            onkeypress="return event.charCode >= 48 && event.charCode <= 57"
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
          <button @click="saveStudent" class="add">Released Documents</button>
        </div>
      </div>
    </div>
  </div>

    <!-- released Modal -->
    <div v-if="showreleasedModal" class="modal-overlay">
    <div class="modal-content">
      <div class="student-file-upload-released" @click="triggerFileInput">
        <label for="fileInput" class="upload-box">
          <!-- <p><i class="fas fa-upload"></i></p> -->
          <p v-if="!uploadedFile"></p>
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
            placeholder=""
            readonly
          />
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
          <input
          type="date"
          v-model="birthdate"
          readonly />
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
          <input
            type="text"
            v-model="Curriculum"
            placeholder=""
            readonly
          />
        </div>
        <div class="input-group">
          <label>Academic Track</label>
          <input
            type="text"
            v-model="AcademicTrack"
            placeholder=""
            readonly
          />
        </div>
        <h5>Processor Information</h5>
        <div class="input-group">
          <label>Faculty Name</label>
          <input
            type="text"
            v-model="FacultyName"
            placeholder=""
            readonly
          />
        </div>
        <div class="input-group">
          <label>Document Released</label>
          <input
            type="text"
            v-model="FacultyName"
            placeholder=""
            readonly
          />
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
  

      <!-- Unreleased Modal -->
      <div v-if="showunreleasedModal" class="modal-overlay">
    <div class="modal-content">
      <div class="student-file-upload-released" @click="triggerFileInput">
        <label for="fileInput" class="upload-box">
          <!-- <p><i class="fas fa-upload"></i></p> -->
          <p v-if="!uploadedFile"></p>
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
            placeholder=""
            readonly
          />
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
          <input
          type="date"
          v-model="birthdate"
          readonly />
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
          <input
            type="text"
            v-model="Curriculum"
            placeholder=""
            readonly
          />
        </div>
        <div class="input-group">
          <label>Academic Track</label>
          <input
            type="text"
            v-model="AcademicTrack"
            placeholder=""
            readonly
          />
        </div>
        <h5>Processor Information</h5>
        <div class="input-group">
          <label>Faculty Name</label>
          <input
            type="text"
            v-model="FacultyName"
            placeholder=""
            readonly
          />
        </div>
        <div class="input-group">
          <label>Document Released</label>
          <input
            type="text"
            v-model="FacultyName"
            placeholder=""
            readonly
          />
        </div>
        <div class="input-group">
          <label>Date of Released</label>
          <input type="text" v-model="DateAdded" placeholder="" readonly />
        </div>
        <div class="furnished">
          <div class="apply-button">
            <p>Apply Copy Furnished</p>
          </div>
          <div class="status-apply">
            <p>Copy Furnished Applied</p>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="closeUnReleasedModal  " class="cancel">Back</button>
          <button class="add">Released Documents</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  data(){
    return{
        showModal: false,
        showreleasedModal: false,
        showunreleasedModal: false,
    }
  },
  methods: {
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
      this.showModal = true;
    },
    closeModal() {
      this.removeFile();
      this.showModal = false;
    },
    saveStudent() {
      console.log("Saving student:", this.newStudent);
      this.closeModal();
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];

      if (file && file.type === "application/pdf") {
        this.uploadedFile = file;
        this.pdfUrl = URL.createObjectURL(file);
      } else {
        alert("Please upload a valid PDF file.");
        event.target.value = "";
      }
    },
    removeFile() {
      this.uploadedFile = null;
      this.pdfUrl = "";
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
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
.furnished{
  display: flex;
  font-size: 8px;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
  
}
.apply-button{
  background: #0C5A48;
  color: #fff;
  border: none;
  padding: 3px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 50%;
}
.status-apply{
  border: 1px solid #0C5A48;
  padding: 3px 20px;
  border-radius: 5px;
  color: #0C5A48;
  width: 50%;
}
</style>
