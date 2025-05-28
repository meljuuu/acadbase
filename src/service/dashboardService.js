import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class DashboardService {
    // Get student statistics
    async getStudentStats() {
        try {
            const response = await axios.get(`${API_URL}/dashboard/student-stats`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Get student gender distribution
    async getGenderDistribution() {
        try {
            const response = await axios.get(`${API_URL}/dashboard/students/gender-distribution`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Get student grade distribution
    async getGradeDistribution() {
        try {
            const response = await axios.get(`${API_URL}/dashboard/students/grade-distribution`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Get latest students
    async getLatestStudents() {
        try {
            const response = await axios.get(`${API_URL}/dashboard/latest-students`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Get released documents statistics
    async getReleasedDocsStats() {
        try {
            const response = await axios.get(`${API_URL}/dashboard/released-docs-stats`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Get student status counts
    async getStudentStatusCounts() {
        try {
            const response = await axios.get(`${API_URL}/dashboard/student-status-counts`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new DashboardService();