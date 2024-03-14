import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'http://localhost/api' : 'http://localhost:3000/api'
});

export default api;
