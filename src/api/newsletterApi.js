import api from './axios';

export const newsletterApi = {
    // Public Routes
    subscribe: async (email) => {
        const response = await api.post('/newsletters/subscribe', { email });
        return response.data;
    },

    unsubscribe: async (email) => {
        const response = await api.post('/newsletters/unsubscribe', { email });
        return response.data;
    },

    // Admin Routes
    getAllSubscribersAdmin: async () => {
        const response = await api.get('/newsletters');
        return response.data;
    },

    deleteSubscriber: async (id) => {
        const response = await api.delete(`/newsletters/${id}`);
        return response.data;
    }
};
