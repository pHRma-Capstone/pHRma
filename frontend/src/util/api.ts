import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'http://35.153.163.209:3000/api' : 'http://localhost:3000/api'
});

export default api;
