import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const menuAPI = {
    getAll: () => api.get('/menu'),
    getByCategory: (category) => api.get(`/menu/${category}`),
};

export const reservationAPI = {
    create: (data) => api.post('/reservation', data),
};

export const contactAPI = {
    send: (data) => api.post('/contact', data),
};

export const newsletterAPI = {
    subscribe: (email) => api.post('/newsletter', { email }),
};

export default api;