import api from './axios';

export const commentApi = {
    // Get all comments for an article
    getAll: (articleId, params = {}) => api.get(`/comments/${articleId}`, { params }),

    // Add a new comment
    add: (articleId, content) => api.post(`/comments/${articleId}`, { content }),

    // Delete a comment (RBAC handled by backend)
    delete: (commentId) => api.delete(`/comments/${commentId}`),
};
