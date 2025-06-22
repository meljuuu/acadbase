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
          />
        </div>
        <div class="input-group">
          <label>Birthdate</label>
          <input 
            type="date" 
            v-model="birthdate"
          />
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
          <select v-model="Curriculum">
            <option value="">Select Curriculum</option>
            <option value="JHS">JHS</option>
            <option value="SHS">SHS</option>
          </select>
        </div>
        <div class="input-group">
          <label>Academic Track</label>
          <select v-model="AcademicTrack">
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

        <div class="input-group" v-if="furnishedDate">
          <label>Document Furnished Date</label>
          <input type="text" :value="formatDate(furnishedDate)" readonly />
        </div>
        <div class="input-group" v-if="furnishedBy">
          <label>Furnished By</label>
          <input type="text" :value="furnishedBy" readonly />
        </div>

        <div class="modal-buttons">
          <button @click="closeModal" class="cancel">Cancel</button>
          <button @click="saveStudent" class="add">Add Student</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Release Modal -->
  <div v-if="showreleasedModal" class="modal-overlay">
    <div class="modal-content">
      <div class="student-file-upload-released" @click="!hasStampedPdf && triggerFileInput" :class="{ 'disabled-upload': hasStampedPdf }">
        <label for="fileInput" class="upload-box">
          <p><i class="fas fa-upload"></i></p>
          <p v-if="!uploadedFile && !hasStampedPdf">Upload PDF File (PDF Only)</p>
          <p v-else-if="hasStampedPdf">Document Already Furnished</p>
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
          :disabled="hasStampedPdf"
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
          <input type="text" :value="formatDate(DateAdded)" placeholder="" readonly />
        </div>

        <div class="input-group" v-if="furnishedDate">
          <label>Document Furnished Date</label>
          <input type="text" :value="formatDate(furnishedDate)" readonly />
        </div>
        <div class="input-group" v-if="furnishedBy">
          <label>Furnished By</label>
          <input type="text" :value="furnishedBy" readonly />
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
        </div>
      </div>

      <div class="student-processor-information">
        <div class="header-actions">
          <h5>Student Information</h5>
          <button 
            v-if="!isEditMode" 
            @click="toggleEditMode" 
            class="edit-button"
          >
            Edit
          </button>
        </div>
        
        <div class="input-group">
          <label>Student Name</label>
          <input
            type="text"
            v-model="Name"
            :readonly="!isEditMode"
            :class="{ 'editable': isEditMode }"
          />
        </div>
        <div class="input-group">
          <label>LRN</label>
          <input
            type="text"
            v-model="lrn"
            :readonly="!isEditMode"
            :class="{ 'editable': isEditMode }"
            maxlength="12"
            @input="validateLRN"
          />
        </div>
        <div class="input-group">
          <label>Birthdate</label>
          <input 
            type="date" 
            v-model="birthdate"
            :readonly="!isEditMode"
            :class="{ 'editable': isEditMode }"
          />
        </div>
        <div class="input-group">
          <label>S.Y Batch</label>
          <select 
            v-model="syBatch"
            :disabled="!isEditMode"
            :class="{ 'editable': isEditMode }"
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
        </div>
        <div class="input-group">
          <label>Curriculum</label>
          <select 
            v-model="Curriculum"
            :disabled="!isEditMode"
            :class="{ 'editable': isEditMode }"
          >
            <option value="">Select Curriculum</option>
            <option value="JHS">JHS</option>
            <option value="SHS">SHS</option>
          </select>
        </div>
        <div class="input-group">
          <label>Academic Track</label>
          <select 
            v-model="AcademicTrack"
            :disabled="!isEditMode"
            :class="{ 'editable': isEditMode }"
          >
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
            :readonly="!isEditMode"
            :class="{ 'editable': isEditMode }"
          />
        </div>
        <div class="input-group">
          <label>Document Released</label>
          <input
            type="text"
            v-model="FacultyName"
            :readonly="!isEditMode"
            :class="{ 'editable': isEditMode }"
          />
        </div>
        <div class="input-group">
          <label>Date of Released</label>
          <input
            type="text"
            :value="formatDate(DateAdded)"
            :readonly="!isEditMode"
            :class="{ 'editable': isEditMode }"
          />
        </div>
        <div class="input-group" v-if="furnishedDate">
          <label>Document Furnished Date</label>
          <input
            type="text"
            :value="formatDate(furnishedDate)"
            :readonly="!isEditMode"
            :class="{ 'editable': isEditMode }"
          />
        </div>
        <div class="input-group" v-if="furnishedBy">
          <label>Furnished By</label>
          <input
            type="text"
            :value="furnishedBy"
            :readonly="!isEditMode"
            :class="{ 'editable': isEditMode }"
          />
        </div>
        <div class="furnished">
          <button
            class="apply-button"
            :disabled="isProcessing || hasStampedPdf || !originalPdfUrl"
            :style="{
              backgroundColor: isApplied || hasStampedPdf ? '#fff' : '#0c5a48',
              color: isApplied || hasStampedPdf ? '#0c5a48' : '#fff',
            }"
            @click="toggleApplyStatus"
          >
            <p>
              <span v-if="isProcessing" class="loading-spinner"></span>
              <font-awesome-icon v-if="isApplied || hasStampedPdf" icon="check" class="mr-1" />
              {{ isProcessing ? 'Processing...' : (isApplied || hasStampedPdf ? "Copy Furnished Applied" : "Apply Copy Furnished") }}
            </p>
          </button>
          <p v-if="!originalPdfUrl" class="note">Upload a PDF document first to enable copy furnish</p>
        </div>

        <div class="modal-buttons">
          <button @click="closeUnReleasedModal" class="cancel">Back</button>
          <button 
            v-if="isEditMode" 
            @click="toggleEditMode" 
            class="cancel"
          >
            Cancel Edit
          </button>
          <button 
            v-if="isEditMode" 
            @click="saveStudentInfo" 
            class="save-button"
          >
            Save Changes
          </button>
          <button @click="markAsDropOut" class="dropout-button">Drop Out</button>
          <button 
            @click="downloadStampedPdf" 
            class="released-button"
            :disabled="!hasStampedPdf || isDownloading"
          >
            <span v-if="isDownloading" class="loading-spinner"></span>
            {{ isDownloading ? 'Downloading...' : 'Released Documents' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MasterlistService from '../service/MasterlistService';
import ReleaseService from '../service/releaseService';
import Swal from 'sweetalert2';
import axios from 'axios';

// Define API_BASE_URL (use the same value as in MasterlistService.js)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const PDF_BASE_URL = import.meta.env.VITE_API_PDF || `${API_BASE_URL}/storage`;

export default {
  name: "Modal",
  emits: ['student-saved', 'csvUploaded'],
  data() {
    return {
      showModal: false,
      showreleasedModal: false,
      showunreleasedModal: false,
      uploadedFile: null,
      pdfUrl: null,
      originalPdfUrl: null,
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
        "2025-2026", "2024-2025", "2023-2024", 
        "2022-2023", "2021-2022", "2020-2021", "2019-2020"
      ],
      isProcessing: false,
      studentId: null,
      studentStatus: 'Not-Applicable',
      hasStampedPdf: false,
      stampedPdfPath: null,
      furnishedDate: null,
      furnishedBy: null,
      isDownloading: false,
      isEditMode: false,
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
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.log("No user found in localStorage");
          return "";
        }

        // Match the actual data structure from localStorage
        const { FirstName, MiddleName, LastName, Suffix } = user;
        
        // Build the full name with proper spacing
        let fullName = FirstName || "";
        if (MiddleName) fullName += ` ${MiddleName}`;
        if (LastName) fullName += ` ${LastName}`;
        if (Suffix) fullName += ` ${Suffix}`;

        console.log("Constructed faculty name:", fullName.trim());
        return fullName.trim();
      } catch (error) {
        console.error("Error getting faculty name:", error);
        return "";
      }
    },
    async fetchStudentData(id) {
      if (!id) {
        console.error("Invalid student ID:", id);
        // await Swal.fire({
        //   icon: 'error',
        //   title: 'Error',
        //   text: 'Invalid student ID. Please try again.',
        //   confirmButtonColor: '#295f98'
        // });
        return;
      }

      try {
        const student = await MasterlistService.getStudent(id);
        
        // Reset all states first
        this.hasStampedPdf = false;
        this.stampedPdfPath = null;
        this.isApplied = false;
        this.pdfUrl = null;
        this.originalPdfUrl = null;
        
        // Set basic student information
        this.Name = student.name;
        this.lrn = student.lrn;
        this.birthdate = student.birthdate || '';
        this.syBatch = student.batch;
        this.Curriculum = student.curriculum;
        this.AcademicTrack = student.track;
        this.DateAdded = student.created_at || new Date().toLocaleDateString();

        // Check for stamped PDF
        if (student.stamped_pdf_storage) {
          this.hasStampedPdf = true;
          this.stampedPdfPath = student.stamped_pdf_storage;
          const stampedPath = student.stamped_pdf_storage.replace('public/', '');
          this.pdfUrl = `${PDF_BASE_URL}/${stampedPath}`;
          this.isApplied = true;
          this.furnishedDate = student.furnished_date;
          this.furnishedBy = student.furnished_by;
          console.log('Student has stamped PDF:', this.stampedPdfPath);
        } else if (student.pdf_storage) {
          let pdfPath = student.pdf_storage.replace('public/pdfs/public/pdfs/', 'public/pdfs/');
          if (!pdfPath.endsWith('.pdf')) pdfPath += '.pdf';
          
          pdfPath = pdfPath.replace('public/', '');
          this.originalPdfUrl = `${PDF_BASE_URL}/${pdfPath}`;
          this.pdfUrl = this.originalPdfUrl;
          console.log('Student has original PDF:', this.originalPdfUrl);
        } else {
          console.log('Student has no PDF files');
        }
        
        this.updateStudentStatus();
      } catch (error) {
        console.error("Error fetching student data:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch student data. Please try again.',
          confirmButtonColor: '#295f98'
        });
      }
    },
    showUnReleasedModal(id) {
      // Reset all states
      this.studentId = null;
      this.hasStampedPdf = false;
      this.stampedPdfPath = null;
      this.isApplied = false;
      this.pdfUrl = null;
      this.originalPdfUrl = null;
      this.isProcessing = false;
      this.uploadedFile = null;
      this.pdfLoadFailed = false;
      
      // Set new student ID first
      this.studentId = id;
      console.log('Setting student ID:', id);
      
      // Get faculty name from localStorage when modal opens
      this.FacultyName = this.getFacultyName();
      
      // Fetch student data
      this.fetchStudentData(id);
      this.showunreleasedModal = true;
    },
    closeUnReleasedModal() {
      // Reset all states
      this.studentId = null;
      this.hasStampedPdf = false;
      this.stampedPdfPath = null;
      this.isApplied = false;
      this.pdfUrl = null;
      this.originalPdfUrl = null;
      this.isProcessing = false;
      this.uploadedFile = null;
      this.pdfLoadFailed = false;
      
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
      // Only validate LRN format if it's provided and not empty
      if (this.lrn && this.lrn.trim() !== '') {
        // Remove any non-numeric characters and validate length
        const cleanLrn = this.lrn.replace(/[^0-9]/g, '');
        if (cleanLrn.length !== 12) {
          await Swal.fire({
            icon: 'error',
            title: 'Invalid LRN',
            text: 'LRN must be exactly 12 digits.',
            confirmButtonColor: '#295f98'
          });
          return;
        }
        this.lrn = cleanLrn; // Update with cleaned LRN
      }

      // Validate file size if a file is uploaded
      if (this.uploadedFile && this.uploadedFile.size > 10 * 1024 * 1024) {
        await Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'PDF file size must not exceed 10MB.',
          confirmButtonColor: '#295f98'
        });
        return;
      }

      try {
        // Validate track if provided
        const validTracks = ['SPJ', 'BEC', 'SPA'];
        const track = this.AcademicTrack && validTracks.includes(this.AcademicTrack) 
          ? this.AcademicTrack 
          : null;

        // Validate curriculum if provided
        const validCurriculums = ['JHS', 'SHS'];
        const curriculum = this.Curriculum && validCurriculums.includes(this.Curriculum)
          ? this.Curriculum
          : null;

        // Validate birthdate if provided
        let birthdate = null;
        if (this.birthdate) {
          const date = new Date(this.birthdate);
          if (!isNaN(date.getTime())) {
            birthdate = this.birthdate;
          }
        }

        const studentData = {
          lrn: this.lrn || null,
          name: this.Name || null,
          track: track,
          batch: this.syBatch || null,
          curriculum: curriculum,
          status: this.uploadedFile ? 'Unreleased' : 'Not-Applicable',
          faculty_name: this.FacultyName || null,
          birthdate: birthdate,
          pdfFile: this.uploadedFile || null,
        };

        // Log the data being sent for debugging
        console.log('Submitting student data:', studentData);

        const response = await MasterlistService.addStudent(studentData);
        console.log('Server response:', response);
        
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Student added successfully',
          confirmButtonColor: '#295f98'
        });
        
        this.closeModal();
        this.$emit("student-saved");
        
        // Add page refresh after successful save
        setTimeout(() => {
          window.location.reload();
        }, 500);

      } catch (error) {
        console.error("Error saving student:", error);
        
        if (error.response?.data?.errors) {
          const validationErrors = error.response.data.errors;
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          
          await Swal.fire({
            icon: 'error',
            title: 'Validation Errors',
            html: `<pre style="text-align: left;">${errorMessages}</pre>`,
            confirmButtonColor: '#295f98'
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to save student: ${error.response?.data?.message || error.message}`,
            confirmButtonColor: '#295f98'
          });
        }
      }
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
    async toggleApplyStatus() {
      if (this.isProcessing) return;
      
      try {
        this.isProcessing = true;
        
        if (!this.isApplied) {
          // Add a small delay to ensure studentId is set
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (!this.studentId) {
            console.error('Student ID is missing:', this.studentId);
            throw new Error('Student ID is missing');
          }

          // Log the student ID for debugging
          console.log('Applying copy furnish for student ID:', this.studentId);

          const response = await ReleaseService.addImageOverlay(this.studentId);
          
          if (response.success && response.stampedPdfPath) {
            const stampedPath = response.stampedPdfPath.replace('public/', '');
            this.pdfUrl = `${PDF_BASE_URL}/${stampedPath}`;
            this.furnishedDate = response.furnishedDate;
            this.furnishedBy = response.furnishedBy;
            
            // Show success message
            await Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Document furnished successfully',
              confirmButtonColor: '#295f98'
            });

            // First refresh
            this.closeUnReleasedModal();
            this.$emit('student-saved');
            
            // First reopen after 500ms
            setTimeout(() => {
              this.showUnReleasedModal(this.studentId);
              
              // Second refresh after another 500ms
              setTimeout(() => {
                this.closeUnReleasedModal();
                this.$emit('student-saved');
                
                // Final reopen after 500ms
                setTimeout(() => {
                  this.showUnReleasedModal(this.studentId);
                }, 500);
              }, 500);
            }, 500);
          }
        } else {
          this.pdfUrl = this.originalPdfUrl;
        }
        
        this.isApplied = !this.isApplied;
      } catch (error) {
        console.error('Error applying copy furnished:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to furnish document. Please try again.',
          confirmButtonColor: '#295f98'
        });
      } finally {
        this.isProcessing = false;
      }
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
    async markAsDropOut() {
      if (!this.studentId) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Student ID is missing',
          confirmButtonColor: '#295f98'
        });
        return;
      }

      try {
        // Show confirmation dialog
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Confirm Drop Out',
          text: 'Are you sure you want to mark this student as dropped out?',
          showCancelButton: true,
          confirmButtonColor: '#dc3545',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Yes, mark as dropped out',
          cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
          // Use "Dropped-Out" to match the database value
          const response = await ReleaseService.updateStatus(this.studentId, 'Dropped-Out');
          
          if (response.success) {
            await Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Student status updated to Dropped Out',
              confirmButtonColor: '#295f98'
            });

            // Close the modal
            this.closeUnReleasedModal();
            
            // Emit event to refresh the list
            this.$emit('student-saved');
            
            // Refresh the page after a short delay
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        }
      } catch (error) {
        console.error('Error updating student status:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update student status: ' + (error.response?.data?.message || error.message),
          confirmButtonColor: '#295f98'
        });
      }
    },
    async saveStudentInfo() {
      if (!this.studentId) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Student ID is missing',
          confirmButtonColor: '#295f98'
        });
        return;
      }

      try {
        // Update student status before saving
        this.updateStudentStatus();

        const studentData = {
          name: this.Name,
          lrn: this.lrn,
          birthdate: this.birthdate,
          batch: this.syBatch,
          curriculum: this.Curriculum,
          track: this.AcademicTrack,
          faculty_name: this.FacultyName,
          status: this.studentStatus,
          pdfFile: this.uploadedFile || null
        };

        const response = await MasterlistService.updateStudent(this.studentId, studentData);
        
        if (response.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Student information updated successfully',
            confirmButtonColor: '#295f98'
          });
          
          // Exit edit mode after successful save
          this.isEditMode = false;
          
          // Close modal and emit event to refresh the list
          this.closeUnReleasedModal();
          this.$emit('student-saved');
          
          // Refresh the page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          throw new Error(response.message || 'Update failed');
        }
      } catch (error) {
        console.error('Error updating student:', error);
        if (error.response?.data?.errors) {
          const validationErrors = error.response.data.errors;
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          
          await Swal.fire({
            icon: 'error',
            title: 'Validation Errors',
            html: `<pre style="text-align: left;">${errorMessages}</pre>`,
            confirmButtonColor: '#295f98'
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update student information: ' + (error.message || 'Unknown error'),
            confirmButtonColor: '#295f98'
          });
        }
      }
    },
    updateStudentStatus() {
      // If all required fields are present, set status to Unreleased
      if (this.isStudentInfoComplete) {
        this.studentStatus = 'Unreleased';
      } else {
        this.studentStatus = 'Not-Applicable';
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },
    async downloadStampedPdf() {
      if (!this.studentId) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Student ID is missing',
          confirmButtonColor: '#295f98'
        });
        return;
      }

      if (!this.hasStampedPdf) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No stamped document available for download',
          confirmButtonColor: '#295f98'
        });
        return;
      }

      try {
        this.isDownloading = true;
        const response = await ReleaseService.downloadStampedPdf(this.studentId);

        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Document downloaded successfully and status updated to Released',
          confirmButtonColor: '#295f98'
        });

        // Close the modal
        this.closeUnReleasedModal();
        
        // Emit event to refresh the list
        this.$emit('student-saved');
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 500);

      } catch (error) {
        console.error('Download error:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Download Failed',
          text: error.response?.data?.message || 'Failed to download the document',
          confirmButtonColor: '#295f98'
        });
      } finally {
        this.isDownloading = false;
      }
    },
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    removeFile() {
      // Clear the file input
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      
      // Reset file-related states
      this.uploadedFile = null;
      this.pdfUrl = null;
      this.originalPdfUrl = null;
      this.pdfLoadFailed = false;
      
      // Update student status after removing file
      this.updateStudentStatus();
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
    this.updateStudentStatus();
    // Set faculty name when component is mounted
    this.FacultyName = this.getFacultyName();
    
    // Log environment variables
    console.log('Environment Variables:', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_API_PDF: import.meta.env.VITE_API_PDF,
      ALL_ENV: import.meta.env
    });
  },
  watch: {
    // Watch for changes in student information
    Name: 'updateStudentStatus',
    birthdate: 'updateStudentStatus',
    syBatch: 'updateStudentStatus',
    Curriculum: 'updateStudentStatus',
    AcademicTrack: 'updateStudentStatus',
    uploadedFile: 'updateStudentStatus'
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
  width: 850px;
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

.modal-content input,
.modal-content select {
  width: 95%;
  padding: 8px;
  margin-top: -1px;
  margin-bottom: 5px;
  border: 1px solid #295f98;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content input::placeholder {
  font-size: 11px;
  color: #295f98;
}

.modal-content input:focus,
.modal-content select:focus {
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
.apply-button, .status-apply {
  position: relative;
}

.apply-button:disabled, .status-apply:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Add loading spinner styles */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0c5a48;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

select.editable {
  background-color: #fff !important;
  border-color: #295f98 !important;
  cursor: pointer !important;
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

.modal-buttons button.dropout-button {
  background: #dc3545;
  color: white;
}

.modal-buttons button.save-button {
  background: #28a745;
  color: white;
}

.released-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    background-color: #0c5a48;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.released-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.released-button .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.edit-button {
  padding: 5px 15px;
  background-color: #295f98;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.edit-button:hover {
  background-color: #1e4b7a;
}

.editable {
  background-color: #fff !important;
  border-color: #295f98 !important;
  cursor: pointer !important;
}

.editable:focus {
  box-shadow: 0 0 3px rgba(41, 95, 152, 0.5);
}

/* Update existing input styles */
.modal-content input:not(.editable) {
  background-color: #f5f5f5;
  cursor: pointer !important;
}

.modal-content select:not(.editable) {
  background-color: #f5f5f5;
  cursor: pointer !important;
}

/* Add hover effect for inputs in Add Student modal */
.modal-content input:hover,
.modal-content select:hover {
  border-color: #1e4b7a;
  box-shadow: 0 0 3px rgba(41, 95, 152, 0.3);
}
</style>
