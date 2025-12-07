import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL ? `${import.meta.env.VITE_SERVER_URL}/api` : '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const emailApi = {
    create: async () => {
        const response = await api.post('/email?action=new');
        return response.data;
    },
    sync: async (address) => {
        const response = await api.post(`/email?action=sync&address=${encodeURIComponent(address)}`);
        return response.data;
    },
    getMessages: async (address) => {
        const response = await api.get(`/email?action=messages&address=${encodeURIComponent(address)}`);
        return response.data;
    },
    delete: async (address) => {
        const response = await api.delete(`/email?action=delete&address=${encodeURIComponent(address)}`);
        return response.data;
    }
};

export const phoneApi = {
    create: async () => {
        const response = await api.post('/phone?action=new');
        return response.data;
    },
    getMessages: async (number) => {
        const response = await api.get(`/phone?action=messages&number=${encodeURIComponent(number)}`);
        return response.data;
    },
    delete: async (number) => {
        const response = await api.delete(`/phone?action=delete&number=${encodeURIComponent(number)}`);
        return response.data;
    },
    simulate: async (number) => {
        const response = await api.post(`/phone?action=simulate&number=${encodeURIComponent(number)}`);
        return response.data;
    }
};

export const cardApi = {
    create: async () => {
        const response = await api.post('/card?action=new');
        return response.data;
    },
    get: async (id) => {
        const response = await api.get(`/card?action=get&id=${encodeURIComponent(id)}`);
        return response.data;
    },
    toggleLock: async (id) => {
        const response = await api.post(`/card?action=lock&id=${encodeURIComponent(id)}`);
        return response.data;
    },
    getTransactions: async (id) => {
        const response = await api.get(`/card?action=transactions&id=${encodeURIComponent(id)}`);
        return response.data;
    },
    simulate: async (id) => {
        const response = await api.post(`/card?action=simulate&id=${encodeURIComponent(id)}`);
        return response.data;
    }
};

export const settingsApi = {
    clear: async () => {
        const response = await api.post('/settings?action=clear');
        return response.data;
    }
};

export default {
    email: emailApi,
    phone: phoneApi,
    card: cardApi,
    settings: settingsApi
};
