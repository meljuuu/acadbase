import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL

class ReleaseService {
    async addImageOverlay(studentId) {
        try {
            console.log('Sending request with student ID:', studentId); // Debug log
            const response = await axios.post(`${API_BASE_URL}/pdf/add-overlay`, {
                student_id: studentId
            });
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response?.data || error); // Debug log
            throw error.response?.data || error;
        }
    }
}

export default new ReleaseService();
