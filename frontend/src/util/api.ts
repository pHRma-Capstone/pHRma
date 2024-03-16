import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:3000/api'
});

export default api;
