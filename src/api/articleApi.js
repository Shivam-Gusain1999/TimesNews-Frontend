import api from './axios';

export const articleApi = {
    getAll: (params = {}) => api.get('/articles', { params }),

    getBySlug: (slug) => api.get(`/articles/${slug}`),
    incrementView: (slug) => api.post(`/articles/${slug}/view`),

    create: (formData) =>
        api.post('/articles', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    update: (articleId, formData) =>
        api.patch(`/articles/${articleId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    delete: (articleId) => api.delete(`/articles/${articleId}`),

    // Admin: Get All (Drafts + Filter by Status)
    getAdminAll: (params = {}) => api.get('/articles/admin/all', { params }),

    // Admin: Bulk Upload Articles
    bulkUpload: (articlesArray) => api.post('/articles/admin/bulk-upload', { articles: articlesArray }),
};
