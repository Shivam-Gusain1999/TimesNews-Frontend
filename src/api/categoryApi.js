import api from './axios';

export const categoryApi = {
    getAll: () => api.get('/categories'),

    create: (data) => api.post('/categories', data),

    update: (categoryId, data) => api.patch(`/categories/${categoryId}`, data),

    delete: (categoryId) => api.delete(`/categories/${categoryId}`),
};
