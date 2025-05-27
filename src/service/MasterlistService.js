// RESILIENT-AcadBase/src/service/MasterlistService.js
import axios from 'axios';

// Use import.meta.env for Vue 3 or process.env for Vue 2
const API_URL = import.meta.env.VITE_API_URL

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
            const response = await axios.post(`${API_URL}/masterlist`, studentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Get single student
    async getStudent(id) {
        try {
            const response = await axios.get(`${API_URL}/masterlist/${id}`);
            return response.data;
        } catch (error) {
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
}

export default new MasterlistService();