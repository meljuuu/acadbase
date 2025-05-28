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
            
            // Return both success status and the new stamped PDF path
            return {
                success: response.data.success,
                message: response.data.message,
                stampedPdfPath: response.data.stamped_pdf_path
            };
        } catch (error) {
            console.error('API Error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }
}

export default new ReleaseService();
