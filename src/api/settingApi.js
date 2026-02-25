import api from './axios';

export const settingApi = {
    // Public endpoint 
    getSettings: async (type = '') => {
        const response = await api.get('/settings', { params: { type } });
        return response.data;
    },

    // Admin endpoint
    updateSettings: async (settingsArray) => {
        const response = await api.put('/settings', { settings: settingsArray });
        return response.data;
    },
};
