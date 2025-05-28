<template>
  <div>
    <button @click="openImportModal" class="import-class-list">
      <i class="fas fa-file-import mr-2"></i>
      Import Class List
    </button>

    <!-- Modal for CSV Upload -->
    <div v-if="showImportModal" class="modal-overlay" @click.self="closeImportModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Import Class List</h3>
          <button @click="closeImportModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- File Upload Section -->
        <div class="file-upload" @click="triggerFileInput">
          <div class="upload-box" :class="{ 'has-file': uploadedFile }">
            <i class="fas fa-cloud-upload-alt"></i>
            <p v-if="!uploadedFile" class="upload-text">Drag & drop or click to upload CSV</p>
            <p v-else class="file-name">
              {{ uploadedFile.name }}
              <button @click.stop="removeFile" class="remove-btn">
                <i class="fas fa-times"></i>
              </button>
            </p>
            <p class="file-requirements">Supports: .csv (Max 10MB)</p>
          </div>
          <input
            type="file"
            id="fileInput"
            accept=".csv"
            ref="fileInput"
            @change="handleFileUpload"
            hidden
          />
        </div>

        <!-- CSV Preview Table -->
        <div v-if="csvPreview.length" class="preview-section">
          <h4>Preview Data</h4>
          <div class="table-container">
            <table class="csv-preview">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>LRN</th>
                  <th>Birthdate</th>
                  <th>S.Y Batch</th>
                  <th>Curriculum</th>
                  <th>Track</th>
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

        <!-- Action Buttons -->
        <div class="modal-footer">
          <button @click="closeImportModal" class="btn-cancel">Cancel</button>
          <button 
            @click="uploadCSV" 
            class="btn-upload"
            :disabled="!csvPreview.length"
          >
            <i class="fas fa-upload mr-2"></i>
            Upload CSV
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import csvService from '../service/csvService';

export default {
  name: "ImportClassListButton",
  emits: ['csvUploaded'],
  setup(props, { emit }) {
    const showImportModal = ref(false);
    const uploadedFile = ref(null);
    const csvPreview = ref([]);

    const openImportModal = () => showImportModal.value = true;
    const closeImportModal = () => {
      showImportModal.value = false;
      removeFile();
    };

    const triggerFileInput = () => document.getElementById('fileInput').click();

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type === "text/csv") {
        uploadedFile.value = file;
        csvService.parseCSV(file).then(data => csvPreview.value = data);
      }
    };

    const removeFile = () => {
      uploadedFile.value = null;
      csvPreview.value = [];
    };

    const uploadCSV = async () => {
      if (csvPreview.value.length) {
        try {
          await csvService.uploadCSV(uploadedFile.value);
          emit('csvUploaded');
          closeImportModal();
        } catch (error) {
          alert("Failed to upload CSV: " + error.message);
        }
      }
    };

    return {
      showImportModal,
      uploadedFile,
      csvPreview,
      openImportModal,
      closeImportModal,
      triggerFileInput,
      handleFileUpload,
      removeFile,
      uploadCSV,
    };
  },
};
</script>

<style scoped>
/* Base Styles */
.import-class-list {
  background: linear-gradient(135deg, #295f98, #1f4b79);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.import-class-list:hover {
  background: linear-gradient(135deg, #1f4b79, #295f98);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.import-class-list:active {
  transform: translateY(0);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #295f98;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #777;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

/* File Upload Section */
.file-upload {
  padding: 20px;
  text-align: center;
}

.upload-box {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: #295f98;
  background: #f8fafc;
}

.upload-box.has-file {
  border-color: #4CAF50;
  background: #f0fff4;
}

.upload-box i {
  font-size: 48px;
  color: #295f98;
  margin-bottom: 15px;
}

.upload-text {
  margin: 10px 0;
  color: #555;
  font-size: 16px;
}

.file-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  color: #295f98;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 16px;
}

.file-requirements {
  color: #777;
  font-size: 14px;
  margin-top: 10px;
}

/* Preview Section */
.preview-section {
  padding: 0 20px 20px;
}

.preview-section h4 {
  color: #295f98;
  margin-bottom: 15px;
  font-size: 18px;
}

.table-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 6px;
}

.csv-preview {
  width: 100%;
  border-collapse: collapse;
}

.csv-preview th, .csv-preview td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.csv-preview th {
  background: #f5f7fa;
}
</style>
