<template>
  <div>
    <button @click="openImportModal" class="import-class-list">
      Import Class List
    </button>
    <Modal v-if="showImportModal" @close="closeImportModal">
      <!-- CSV Upload UI -->
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
      </div>

      <!-- CSV Preview Table -->
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

      <!-- Action Buttons -->
      <div class="modal-buttons">
        <button @click="closeImportModal" class="cancel">Cancel</button>
        <button @click="uploadCSV" class="upload">Upload CSV</button>
      </div>
    </Modal>
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
      } else {
        alert("Please upload a valid CSV file.");
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
.import-class-list {
  background: #295f98;
  color: #fff;
  border: none;
  padding: 15px 20px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.import-class-list:hover {
  background: #1f4b79;
}
</style>
