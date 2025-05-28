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

    // Add this new method to the ReleaseService class
    async downloadStampedPdf(studentId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/pdf/download-stamped/${studentId}`, {
                responseType: 'blob' // Important for handling file downloads
            });
            
            // Create a blob URL from the response
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = 'stamped_document.pdf';
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the blob URL
            window.URL.revokeObjectURL(url);
            
            return {
                success: true,
                message: 'PDF downloaded successfully'
            };
        } catch (error) {
            console.error('Download Error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }
}

export default new ReleaseService();
