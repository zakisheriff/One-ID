const request = require('supertest');
const express = require('express');
const emailRoutes = require('../routes/email');
const inboxService = require('../services/inboxService');

const app = express();
app.use(express.json());
app.use('/api/email', emailRoutes);

describe('Email API', () => {
    beforeEach(() => {
        inboxService.clearAll();
    });

    it('should create a new email address', async () => {
        const res = await request(app).post('/api/email/new');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('address');
        expect(res.body.address).toContain('@safeid.lab');
    });

    it('should get messages for an address', async () => {
        const address = inboxService.generateAddress();
        const res = await request(app).get(`/api/email/${address}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('messages');
        expect(Array.isArray(res.body.messages)).toBe(true);
    });

    it('should delete an inbox', async () => {
        const address = inboxService.generateAddress();
        const res = await request(app).delete(`/api/email/${address}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
