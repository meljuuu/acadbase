<template>
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
          <input type="text" v-model="Name" readonly />
        </div>
        <div class="input-group">
          <label>LRN</label>
          <input type="text" v-model="lrn" maxlength="12" readonly />
        </div>
        <div class="input-group">
          <label>Birthdate</label>
          <input type="date" v-model="birthdate" readonly />
        </div>
        <div class="input-group">
          <label>S.Y Batch</label>
          <input type="number" v-model="syBatch" readonly />
        </div>
        <div class="input-group">
          <label>Curriculum</label>
          <input type="text" v-model="Curriculum" readonly />
        </div>
        <div class="input-group">
          <label>Academic Track</label>
          <input type="text" v-model="AcademicTrack" readonly />
        </div>

        <h5>Processor Information</h5>
        <div class="input-group">
          <label>Faculty Name</label>
          <input type="text" v-model="FacultyName" readonly />
        </div>
        <div class="input-group">
          <label>Document Released</label>
          <input type="text" v-model="FacultyName" readonly />
        </div>
        <div class="input-group">
          <label>Date of Released</label>
          <input type="text" v-model="DateAdded" readonly />
        </div>

        <div class="furnished">
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
        </div>

        <div class="modal-buttons">
          <button @click="closeUnReleasedModal" class="cancel">Back</button>
          <button class="released-button" @click="saveUpdate">Save Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showunreleasedModal: false,
      uploadedFile: null,
      pdfUrl: null,
      Name: '',
      lrn: '',
      birthdate: '',
      syBatch: '',
      Curriculum: '',
      AcademicTrack: '',
      FacultyName: '',
      DateAdded: '',
      isApplied: false,
    };
  },
  methods: {
    closeUnReleasedModal() {
      this.showunreleasedModal = false;
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
      this.pdfUrl = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    toggleApplyStatus() {
      this.isApplied = !this.isApplied;
    },
    saveUpdate() {
      // TODO: Implement actual save/update logic here
      alert("Save Update clicked!");
    }
  }
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
