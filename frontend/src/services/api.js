import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('📤 API Request:', config.method.toUpperCase(), config.url);
        console.log('📦 Request Data:', config.data);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('📥 API Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

// ============ HERO APIs ============
export const heroAPI = {
    getContent: () => api.get('/hero'),
};

// ============ ABOUT APIs ============
export const aboutAPI = {
    getContent: () => api.get('/about'),
};

// ============ MENU APIs ============
export const menuAPI = {
    getAll: () => api.get('/menu'),
    getByCategory: (category) => api.get(`/menu/${category}`),
};

// ============ RESERVATION APIs ============
export const reservationAPI = {
    create: (data) => api.post('/reservation', data),
    getAll: () => api.get('/reservations'),
};

// ============ CONTACT APIs ============
export const contactAPI = {
    send: (data) => api.post('/contact', data),
};

// ============ NEWSLETTER APIs ============
export const newsletterAPI = {
    subscribe: (email) => api.post('/newsletter', { email }),
};

// ============ GALLERY APIs ============
export const galleryAPI = {
    getAll: () => api.get('/gallery'),
    getByCategory: (category) => api.get(`/gallery/${category}`),
};

// ============ TESTIMONIALS APIs ============
export const testimonialAPI = {
    getAll: () => api.get('/testimonials'),
    getActive: () => api.get('/testimonials/active'),
};

export default api;