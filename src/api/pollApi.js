import api from './axios';

export const pollApi = {
    // Admin Routes
    createPoll: async (pollData) => {
        const response = await api.post('/polls', pollData);
        return response.data;
    },

    getAllPollsAdmin: async () => {
        const response = await api.get('/polls');
        return response.data;
    },

    updatePollStatus: async (id, status) => {
        const response = await api.patch(`/polls/${id}`, { status });
        return response.data;
    },

    deletePoll: async (id) => {
        const response = await api.delete(`/polls/${id}`);
        return response.data;
    },

    // Public Routes
    getActivePolls: async (limit = 1) => {
        const response = await api.get(`/polls/active?limit=${limit}`);
        return response.data;
    },

    voteInPoll: async (pollId, optionId) => {
        const response = await api.post(`/polls/${pollId}/vote`, { optionId });
        return response.data;
    }
};
