import axios from 'axios';

const API_URL = 'http://localhost:8000/api/admin';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const adminAPI = {
    getDashboard: () => api.get('/dashboard'),
    getReservations: () => api.get('/reservations'),
    updateReservation: (id, data) => api.put(`/reservations/${id}`, data),
    deleteReservation: (id) => api.delete(`/reservations/${id}`),
    getMenu: () => api.get('/menu'),
    createMenu: (data) => api.post('/menu', data),
    updateMenu: (id, data) => api.put(`/menu/${id}`, data),
    deleteMenu: (id) => api.delete(`/menu/${id}`),
    getGallery: () => api.get('/gallery'),
    createGallery: (data) => api.post('/gallery', data),
    updateGallery: (id, data) => api.put(`/gallery/${id}`, data),
    deleteGallery: (id) => api.delete(`/gallery/${id}`),
    getTestimonials: () => api.get('/testimonials'),
    createTestimonial: (data) => api.post('/testimonials', data),
    updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
    deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),
    getHero: () => api.get('/hero'),
    updateHero: (id, data) => api.put(`/hero/${id}`, data),
    getAbout: () => api.get('/about'),
    updateAbout: (id, data) => api.put(`/about/${id}`, data),
    createFeature: (data) => api.post('/about/features', data),
    updateFeature: (id, data) => api.put(`/about/features/${id}`, data),
    deleteFeature: (id) => api.delete(`/about/features/${id}`),
    getContacts: () => api.get('/contacts'),
    
    // ========== HERO STATS API ==========
    getHeroStats: () => api.get('/hero-stats'),
    createHeroStat: (data) => api.post('/hero-stats', data),
    updateHeroStat: (id, data) => api.put(`/hero-stats/${id}`, data),
    deleteHeroStat: (id) => api.delete(`/hero-stats/${id}`),
    updateHeroStatsOrder: (stats) => api.post('/hero-stats/update-order', { stats }),
};

export default adminAPI;