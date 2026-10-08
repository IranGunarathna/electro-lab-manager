
import axios from 'axios';

export const getAuthToken = () => {
  let token = localStorage.getItem('token');
  if (token) return token;
  try {
    const raw = localStorage.getItem('userInfo') || localStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        localStorage.setItem('token', parsed.token);
        return parsed.token;
      }
    }
  } catch (e) {
    console.warn('Error reading token from localStorage:', e);
  }
  return null;
};

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auto injecting json web token into request headers
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;