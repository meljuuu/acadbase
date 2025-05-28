// RESILIENT-AcadBase/src/service/MasterlistService.js
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist'; // Import pdf.js
import { createWorker } from 'tesseract.js';

// Use import.meta.env for Vue 3 or process.env for Vue 2
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class MasterlistService {
    // Get all students with pagination
    async getAllStudents() {
        try {
            const response = await axios.get(`${API_URL}/masterlist`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Add new student
    async addStudent(studentData) {
        try {
            const formData = new FormData();
            formData.append('lrn', studentData.lrn);
            formData.append('name', studentData.name);
            formData.append('track', studentData.track);
            formData.append('batch', studentData.batch);
            formData.append('curriculum', studentData.curriculum);
            formData.append('status', studentData.status);
            formData.append('faculty_name', studentData.faculty_name);
            formData.append('birthdate', studentData.birthdate);
            if (studentData.pdfFile) {
                formData.append('pdf_file', studentData.pdfFile);
            }

            const response = await axios.post(`${API_URL}/masterlist`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Get single student
    async getStudent(id) {
        try {
            console.log(`Fetching student with ID: ${id}`); // Debug log
            const response = await axios.get(`${API_URL}/masterlist/${id}`);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            throw error;
        }
    }

    // Update student
    async updateStudent(id, studentData) {
        try {
            const response = await axios.put(`${API_URL}/masterlist/${id}`, studentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Delete student
    async deleteStudent(id) {
        try {
            const response = await axios.delete(`${API_URL}/masterlist/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Filter students
    async filterStudents(filters) {
        try {
            const response = await axios.get(`${API_URL}/masterlist/filter`, {
                params: filters,
                validateStatus: (status) => status < 500
            });
            
            if (!response.data?.data) {
                throw new Error('API returned unexpected data structure');
            }
            
            return {
                data: response.data.data,
                current_page: response.data.current_page || 1,
                total: response.data.total || 0,
                per_page: response.data.per_page || 20
            };
        } catch (error) {
            console.error('Service layer error:', {
                config: error.config,
                response: error.response,
                message: error.message
            });
            throw error;
        }
    }

    /**
     * Process a PDF file, extract student data, and save it via API.
     * @param {File} pdfFile - The uploaded PDF file.
     * @returns {Promise<Object>} - The saved student data.
     */
    async processPdfAndAddStudent(pdfFile) {
        try {
            // Step 1: Extract text from PDF
            const extractedText = await this.extractTextFromPdf(pdfFile);

            // Step 2: Parse the extracted text into student data
            const studentData = this.parsePdfText(extractedText);
            if (!studentData) {
                throw new Error('Failed to parse required fields from PDF.');
            }

            // Step 3: Save the student data via API
            const response = await this.addStudent(studentData);
            return response;
        } catch (error) {
            console.error('PDF processing error:', error);
            throw error; // Re-throw for handling in the component
        }
    }

    /**
     * Extract text from a PDF file using pdf.js.
     * @param {File} pdfFile - The uploaded PDF file.
     * @returns {Promise<string>} - Extracted text.
     */
    async extractTextFromPdf(pdfFile) {
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
        let extractedText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map(item => item.str).join(' ');
        }

        return extractedText;
    }

    /**
     * Parse extracted text into student data.
     * @param {string} text - Raw text from the PDF.
     * @returns {Object|null} - Parsed student data or null if fields are missing.
     */
    parsePdfText(text) {
        // Adjust these regex patterns to match your PDF's structure
        const lrnMatch = text.match(/LRN[:.]?\s*(\d+)/i);
        const nameMatch = text.match(/Name[:.]?\s*([^\n]+)/i);
        const trackMatch = text.match(/Track[:.]?\s*([^\n]+)/i);
        const curriculumMatch = text.match(/Curriculum[:.]?\s*([^\n]+)/i);
        const yearMatch = text.match(/School Year[:.]?\s*([^\n]+)/i);

        if (!lrnMatch || !nameMatch) {
            return null; // Required fields missing
        }

        return {
            lrn: lrnMatch[1].trim(),
            name: nameMatch[1].trim(),
            track: trackMatch?.[1]?.trim() || '',
            curriculum: curriculumMatch?.[1]?.trim() || '',
            batch: yearMatch?.[1]?.trim() || '',
        };
    }

    async extractTextFromScannedPdf(pdfFile) {
        const worker = await createWorker();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data } = await worker.recognize(pdfFile);
        await worker.terminate();
        return data.text;
    }

    /**
     * Process a CSV file and add multiple students
     * @param {File} csvFile - The uploaded CSV file
     * @returns {Promise<Object>} - The result of the import operation
     */
    async processCsvAndAddStudents(csvFile) {
        try {
            const formData = new FormData();
            formData.append('file', csvFile);

            const response = await axios.post(`${API_URL}/masterlist/bulk`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: (data) => data, // Prevent axios from modifying FormData
            });
            
            return response.data;
        } catch (error) {
            console.error('CSV Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

export default new MasterlistService();