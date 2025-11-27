const express = require('express');
const router = express.Router();
const smsService = require('../services/smsService');
const socketService = require('../services/socketService');

// POST /api/phone/new
router.post('/new', async (req, res) => {
    try {
        const number = await smsService.generateNumber();
        res.json({ number, expiresAt: new Date(Date.now() + smsService.ttl) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/phone/:number
router.get('/:number', async (req, res) => {
    try {
        const messages = await smsService.getMessages(req.params.number);
        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/phone/:number
router.delete('/:number', (req, res) => {
    smsService.deleteNumber(req.params.number);
    res.json({ success: true });
});

// POST /api/phone/:number/send (Simulation trigger)
router.post('/:number/send', (req, res) => {
    const { body, from } = req.body;
    const message = smsService.addMessage(req.params.number, {
        body: body || 'Test message',
        from: from || 'System',
        timestamp: new Date().toISOString()
    });
    socketService.emitSms(req.params.number, message);
    res.json(message);
});

module.exports = router;
