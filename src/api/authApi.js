import api from './axios';

export const authApi = {
    register: (formData) =>
        api.post('/users/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    login: (credentials) => api.post('/users/login', credentials),

    logout: () => api.post('/users/logout'),

    refreshToken: () => api.post('/users/refresh-token'),

    getCurrentUser: () => api.get('/users/current-user'),

    changePassword: (passwords) => api.post('/users/change-password', passwords),

    updateAccount: (details) => api.patch('/users/update-account', details),

    updateAvatar: (formData) =>
        api.patch('/users/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    updateCoverImage: (formData) =>
        api.patch('/users/cover-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};
