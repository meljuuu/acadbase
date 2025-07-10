<template>
  <div>
    <button @click="openImportModal" class="import-class-list">
      <span>Import Class List</span>
    </button>

    <!-- Modal for Excel Upload -->
    <div v-if="showImportModal" class="modal-overlay" @click.self="closeImportModal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-file-excel"></i>
            </div>
            <div>
              <h3>Import Class List</h3>
              <p class="header-subtitle">Upload an Excel file to import student data</p>
            </div>
          </div>
          <button @click="closeImportModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- File Upload Section -->
          <div class="upload-section">
            <div class="file-upload" @click="triggerFileInput">
              <div class="upload-box" :class="{ 'has-file': uploadedFile, 'drag-over': isDragOver }" 
                   @dragover.prevent="isDragOver = true" 
                   @dragleave.prevent="isDragOver = false"
                   @drop.prevent="handleFileDrop">
                <div class="upload-content">
                  <div class="upload-icon">
                    <i class="fas fa-file-excel"></i>
                  </div>
                  <div v-if="!uploadedFile" class="upload-text">
                    <h4>Drop your Excel file here</h4>
                    <p>or <span class="link-text">browse</span> to choose a file</p>
                  </div>
                  <div v-else class="file-info">
                    <h4 class="file-name">{{ uploadedFile.name }}</h4>
                    <p class="file-size">{{ formatFileSize(uploadedFile.size) }}</p>
                    <button @click.stop="removeFile" class="remove-file-btn">
                      <i class="fas fa-trash-alt"></i>
                      Remove file
                    </button>
                  </div>
                </div>
                <div class="file-requirements">
                  <div class="requirement-item">
                    <i class="fas fa-check-circle"></i>
                    <span>Excel (.xlsx) format only</span>
                  </div>
                  <div class="requirement-item">
                    <i class="fas fa-check-circle"></i>
                    <span>Maximum 10MB</span>
                  </div>
                </div>
              </div>
              <input
                type="file"
                id="fileInput"
                accept=".xlsx"
                ref="fileInput"
                @change="handleFileUpload"
                hidden
              />
            </div>
          </div>

          <!-- CSV Preview Table -->
          <div v-if="csvPreview.length" class="preview-section">
            <div class="preview-header">
              <h4>Data Preview</h4>
              <div class="preview-info">
                <span class="record-count">{{ csvPreview.length }} records found</span>
              </div>
            </div>
            <div class="table-wrapper">
              <div class="table-container">
                <table class="csv-preview">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>LRN</th>
                      <th>Gender</th>
                      <th>Birthdate</th>
                      <th>S.Y Batch</th>
                      <th>Curriculum</th>
                      <th>Track</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(student, index) in csvPreview.slice(0, 5)" :key="index">
                      <td>{{ student.Name || '-' }}</td>
                      <td>{{ student.LRN || '-' }}</td>
                      <td>{{ student.Gender || '-' }}</td>
                      <td>{{ student.Birthdate || '-' }}</td>
                      <td>{{ student.syBatch || '-' }}</td>
                      <td>{{ student.Curriculum || '-' }}</td>
                      <td>{{ student.AcademicTrack || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="csvPreview.length > 5" class="table-footer">
                <span class="more-records">... and {{ csvPreview.length - 5 }} more records</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-footer">
          <button @click="closeImportModal" class="btn btn-secondary">
            Cancel
          </button>
          <button 
            @click="uploadExcel"
            class="btn btn-primary"
            :disabled="!csvPreview.length || isUploading"
          >
            <i class="fas fa-spinner fa-spin" v-if="isUploading"></i>
            <i class="fas fa-upload" v-else></i>
            <span>{{ isUploading ? 'Uploading...' : 'Import Excel Data' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import csvService from '../service/csvService';
import Swal from 'sweetalert2';

export default {
  name: "ImportClassListButton",
  emits: ['excelUploaded'],
  setup(props, { emit }) {
    const showImportModal = ref(false);
    const uploadedFile = ref(null);
    const csvPreview = ref([]);
    const isDragOver = ref(false);
    const isUploading = ref(false);

    const openImportModal = () => showImportModal.value = true;
    
    const closeImportModal = () => {
      showImportModal.value = false;
      removeFile();
    };

    const triggerFileInput = () => document.getElementById('fileInput').click();

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      processFile(file);
    };

    const handleFileDrop = (event) => {
      isDragOver.value = false;
      const file = event.dataTransfer.files[0];
      processFile(file);
    };

    const processFile = async (file) => {
      if (file && file.name.endsWith('.xlsx')) {
        if (file.size > 10 * 1024 * 1024) {
          alert("File size exceeds 10MB limit");
          return;
        }
        uploadedFile.value = file;

        try {
          const data = await csvService.parseExcel(file);
          
          // Normalize headers to lowercase
          const normalizedData = data.map(row => {
            const normalizedRow = {};
            for (const key in row) {
              normalizedRow[key.toLowerCase().replace(/\s+/g, '_')] = row[key];
            }
            return normalizedRow;
          });

          // Map data to preview structure
          csvPreview.value = normalizedData.map(row => {
            // Handle birthdate (Excel serial number → "MM/DD/YYYY")
            let birthdate = '-';
            const rawDate = row.birthday || row.birthdate || row.birth_date;
            
            if (rawDate) {
              if (typeof rawDate === 'number') {
                // Convert Excel serial number to date
                const date = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const year = date.getFullYear();
                birthdate = `${month}/${day}/${year}`;
              } else if (typeof rawDate === 'string') {
                // Keep string dates as-is (e.g., "10/16/2002")
                birthdate = rawDate;
              }
            }

            return {
              Name: row.student_name || row.name || '-',
              LRN: row.lrn || '-',
              Gender: row.gender || row.sex || '-',
              Birthdate: birthdate,
              syBatch: row.batch || row.sy_batch || row.school_year || '-',
              Curriculum: row.curriculum || '-',
              AcademicTrack: row.track || row.academic_track || '-',
            };
          });
        } catch (error) {
          alert("Failed to parse Excel file: " + error.message);
        }
      } else {
        alert("Please select a valid Excel (.xlsx) file");
      }
    };

    const removeFile = () => {
      uploadedFile.value = null;
      csvPreview.value = [];
      document.getElementById('fileInput').value = '';
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const uploadExcel = async () => {
      if (csvPreview.value.length) {
        try {
          isUploading.value = true;
          await csvService.uploadCSV(uploadedFile.value);
          
          // Show simple success message without statistics
          await Swal.fire({
            icon: 'success',
            title: 'Import Successful!',
            text: 'The class list has been imported successfully.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2563eb'
          });

          emit('excelUploaded');
          closeImportModal();
          
          // Add page refresh after successful import
          setTimeout(() => {
            window.location.reload();
          }, 500);
          
        } catch (error) {
          // Show error message
          await Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: error.message,
            confirmButtonText: 'Try Again',
            confirmButtonColor: '#dc2626'
          });
        } finally {
          isUploading.value = false;
        }
      }
    };

    return {
      showImportModal,
      uploadedFile,
      csvPreview,
      isDragOver,
      isUploading,
      openImportModal,
      closeImportModal,
      triggerFileInput,
      handleFileUpload,
      handleFileDrop,
      removeFile,
      uploadExcel,
      formatFileSize,
    };
  },
};
</script>

<style scoped>
/* Updated Button Styles */
.import-class-list {
  background: #295f98;
  color: white;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalEnter {
  from { 
    opacity: 0; 
    transform: translateY(-16px) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.header-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  color: #111827;
  font-size: 20px;
  font-weight: 700;
}

.header-subtitle {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 400;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s;
  padding: 8px;
  border-radius: 6px;
}

.close-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 180px);
}

/* Upload Section */
.upload-section {
  margin-bottom: 32px;
}

.upload-box {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
  position: relative;
}

.upload-box:hover,
.upload-box.drag-over {
  border-color: #2563eb;
  background: #eff6ff;
}

.upload-box.has-file {
  border-color: #10b981;
  background: #f0fdf4;
  border-style: solid;
}

.upload-content {
  text-align: center;
  margin-bottom: 24px;
}

.upload-icon {
  font-size: 48px;
  color: #6b7280;
  margin-bottom: 16px;
}

.upload-box.has-file .upload-icon {
  color: #10b981;
}

.upload-text h4 {
  margin: 0 0 8px;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
}

.upload-text p {
  margin: 0;
  color: #6b7280;
  font-size: 15px;
}

.link-text {
  color: #2563eb;
  font-weight: 600;
}

.file-info h4 {
  margin: 0 0 4px;
  color: #059669;
  font-size: 16px;
  font-weight: 600;
}

.file-size {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 14px;
}

.remove-file-btn {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.remove-file-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.file-requirements {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
}

.requirement-item i {
  color: #10b981;
  font-size: 12px;
}

/* Preview Section */
.preview-section {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.preview-header h4 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 600;
}

.record-count {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.table-wrapper {
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.csv-preview {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.csv-preview th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.csv-preview td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}

.csv-preview tr:hover {
  background: #f9fafb;
}

.table-footer {
  padding: 12px 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.more-records {
  color: #6b7280;
  font-size: 13px;
  font-style: italic;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid transparent;
}

.btn-secondary {
  background: white;
  color: #374151;
  border-color: #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-width: calc(100vw - 20px);
  }
  
  .modal-header {
    padding: 20px 16px 0;
  }
  
  .modal-body {
    padding: 20px 16px;
  }
  
  .modal-footer {
    padding: 16px;
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .file-requirements {
    flex-direction: column;
    gap: 8px;
  }
}
</style>