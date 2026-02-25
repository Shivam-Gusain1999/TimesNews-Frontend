import api from './axios';

export const messageApi = {
    sendMessage: async (data) => {
        const response = await api.post('/messages', data);
        return response.data;
    },

    // Admin endpoint to get all messages
    getAllMessages: async (params = { page: 1, limit: 10, isRead: undefined }) => {
        const response = await api.get('/messages', { params });
        return response.data;
    },

    // Admin endpoint to mark message as read
    markAsRead: async (id) => {
        const response = await api.patch(`/messages/${id}/read`);
        return response.data;
    },

    // Admin endpoint to delete message
    deleteMessage: async (id) => {
        const response = await api.delete(`/messages/${id}`);
        return response.data;
    }
};
