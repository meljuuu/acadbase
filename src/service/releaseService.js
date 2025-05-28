import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL

class ReleaseService {
    async addImageOverlay(studentId) {
        try {
            console.log('Sending request with student ID:', studentId);
            const response = await axios.post(`${API_BASE_URL}/pdf/add-overlay`, {
                student_id: studentId
            });
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to add image overlay');
            }
            
            return {
                success: response.data.success,
                message: response.data.message,
                stampedPdfPath: response.data.stamped_pdf_path,
                furnishedDate: response.data.furnished_date,
                furnishedBy: response.data.furnished_by
            };
        } catch (error) {
            console.error('API Error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    // Add new method to check stamped PDF status
    async checkStampedPdfStatus(studentId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/pdf/check-stamped-status/${studentId}`);
            return {
                success: response.data.success,
                hasStampedPdf: response.data.has_stamped_pdf,
                stampedPdfPath: response.data.stamped_pdf_path,
                furnishedDate: response.data.furnished_date,
                furnishedBy: response.data.furnished_by
            };
        } catch (error) {
            console.error('API Error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }
}

export default new ReleaseService();
