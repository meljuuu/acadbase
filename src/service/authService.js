import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const loginTeacher = async (email, password) => {
  try {
    const response = await API.post('/login', {
      email,
      password,
    });
    
    const user = response.data.teacher;
    const token = response.data.token;

    console.log("user: ", user);


    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    return {
      user,
      token,
      role: user.Position, 
    };
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
};