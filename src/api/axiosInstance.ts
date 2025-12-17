// src/api/axiosInstance.ts
import axios from 'axios';
import { LocalStorageService } from '../services/localstorage.service';

const api = axios.create({
  baseURL: 'http://localhost:3006/v1', 
  timeout: 10000,
});


api.interceptors.request.use(
  (config) => {
    const token = LocalStorageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
		console.log(LocalStorageService.getToken() !== null)
		if(LocalStorageService.getToken() !== null){
			console.warn('Token expirado o no autorizado');
			LocalStorageService.setAuthToken(null); 
			window.location.href = '/login';
		}
    }
    return Promise.reject(error);
  },
);

export default api;