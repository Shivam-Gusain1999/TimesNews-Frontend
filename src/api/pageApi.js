import api from './axios';

export const pageApi = {
    // Admin Routes
    getAllPagesAdmin: async () => {
        const response = await api.get('/pages/admin-list');
        return response.data;
    },

    createPage: async (pageData) => {
        const response = await api.post('/pages', pageData);
        return response.data;
    },

    updatePage: async (id, pageData) => {
        const response = await api.put(`/pages/${id}`, pageData);
        return response.data;
    },

    deletePage: async (id) => {
        const response = await api.delete(`/pages/${id}`);
        return response.data;
    },

    getPageById: async (id) => {
        const response = await api.get(`/pages/${id}`);
        return response.data;
    },

    // Public Routes
    getAllPages: async () => {
        const response = await api.get('/pages');
        return response.data;
    },

    getPageBySlug: async (slug) => {
        const response = await api.get(`/pages/slug/${slug}`);
        return response.data;
    }
};
