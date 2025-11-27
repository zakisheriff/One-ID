import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const emailApi = {
    create: async () => {
        const response = await api.post('/email/new');
        return response.data;
    },
    getMessages: async (address) => {
        const response = await api.get(`/email/${address}`);
        return response.data;
    },
    delete: async (address) => {
        const response = await api.delete(`/email/${address}`);
        return response.data;
    },
    getMessage: async (address, id) => {
        const response = await api.get(`/email/${address}/${id}`);
        return response.data;
    }
};

export const phoneApi = {
    create: async () => {
        const response = await api.post('/phone/new');
        return response.data;
    },
    getMessages: async (number) => {
        const response = await api.get(`/phone/${number}`);
        return response.data;
    },
    delete: async (number) => {
        const response = await api.delete(`/phone/${number}`);
        return response.data;
    },
    send: async (number, data) => {
        const response = await api.post(`/phone/${number}/send`, data);
        return response.data;
    }
};

export const cardApi = {
    create: async () => {
        const response = await api.post('/card/new');
        return response.data;
    },
    regenerate: async (id) => {
        const response = await api.post(`/card/${id}/regenerate`);
        return response.data;
    },
    toggleLock: async (id) => {
        const response = await api.post(`/card/${id}/lock`);
        return response.data;
    },
    getTransactions: async (id) => {
        const response = await api.get(`/card/${id}/transactions`);
        return response.data;
    }
};

export const settingsApi = {
    clear: async () => {
        const response = await api.post('/settings/clear');
        return response.data;
    },
    setTTL: async (service, ttl) => {
        const response = await api.post('/settings/ttl', { service, ttl });
        return response.data;
    }
};

export default {
    email: emailApi,
    phone: phoneApi,
    card: cardApi,
    settings: settingsApi
};
