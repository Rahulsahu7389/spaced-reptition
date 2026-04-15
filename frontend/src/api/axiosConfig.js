import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to attach Firebase ID token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error fetching Firebase token', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
