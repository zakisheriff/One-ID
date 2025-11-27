import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const emailApi = {
    create: () => api.post('/email/new'),
    getMessages: (address) => api.get(`/email/${address}`),
    getMessage: (address, id) => api.get(`/email/${address}/${id}`),
    delete: (address) => api.delete(`/email/${address}`),
    getDomains: () => api.get('/email/domains'),
};

export const phoneApi = {
    create: () => api.post('/phone/new'),
    getMessages: (number) => api.get(`/phone/${number}`),
    delete: (number) => api.delete(`/phone/${number}`),
    send: (number, data) => api.post(`/phone/${number}/send`, data),
};

export const cardApi = {
    create: () => api.post('/card/new'),
    regenerate: (id) => api.post(`/card/${id}/regenerate`),
    lock: (id) => api.post(`/card/${id}/lock`),
    getTransactions: (id) => api.get(`/card/${id}/transactions`),
};

export const settingsApi = {
    clear: () => api.post('/settings/clear'),
    setTTL: (service, ttl) => api.post('/settings/ttl', { service, ttl }),
};

export default api;
