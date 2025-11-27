const express = require('express');
const router = express.Router();
const inboxService = require('../services/inboxService');
const socketService = require('../services/socketService');

// POST /api/email/new
router.post('/new', async (req, res) => {
    try {
        const address = await inboxService.generateAddress();
        res.json({ address, expiresAt: new Date(Date.now() + inboxService.ttl) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate email address' });
    }
});

// GET /api/email/:address
router.get('/:address', (req, res) => {
    const messages = inboxService.getMessages(req.params.address);
    res.json({ messages });
});

// GET /api/email/:address/:id
router.get('/:address/:id', (req, res) => {
    const message = inboxService.getMessage(req.params.address, req.params.id);
    if (message) {
        res.json(message);
    } else {
        res.status(404).json({ error: 'Message not found' });
    }
});

// DELETE /api/email/:address
router.delete('/:address', (req, res) => {
    inboxService.clearInbox(req.params.address);
    res.json({ success: true });
});

// GET /api/email/domains
router.get('/domains', (req, res) => {
    res.json({ domains: [inboxService.domain] });
});

module.exports = router;
