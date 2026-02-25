import api from './axios';

export const adminApi = {
    // 1. Get All Users (Admin)
    getUsers: (params = {}) => api.get('/admin/users', { params }),

    // 2. Create User (Editor/Reporter)
    createUser: (formData) => api.post('/admin/users', formData),

    // 3. Block / Unblock User
    toggleBlockUser: (userId) => api.post(`/admin/users/${userId}/block`),

    // 4. Update Role
    updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),

    // 5. Dashboard Stats (Existing)
    // 5. Dashboard Stats (Existing)
    getDashboardStats: () => api.get('/admin/stats'),

    // 6. Manage Comments
    getComments: (params = {}) => api.get('/comments/admin/all', { params }),
    deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};
