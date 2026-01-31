import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me')
};

// Children API
export const childrenAPI = {
    getAll: () => api.get('/children'),
    getOne: (id) => api.get(`/children/${id}`),
    create: (childData) => api.post('/children', childData),
    update: (id, childData) => api.put(`/children/${id}`, childData),
    delete: (id) => api.delete(`/children/${id}`),
    updateVaccination: (childId, vaccinationId, data) => 
        api.put(`/children/${childId}/vaccinations/${vaccinationId}`, data),
    bulkUpdateVaccinations: (childId, vaccinations) =>
        api.put(`/children/${childId}/vaccinations`, { vaccinations })
};

export default api;