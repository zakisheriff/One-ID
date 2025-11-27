const express = require('express');
const router = express.Router();
const inboxService = require('../services/inboxService');
const smsService = require('../services/smsService');
const cardService = require('../services/cardService');

// POST /api/settings/clear
router.post('/clear', (req, res) => {
    inboxService.clearAll();
    smsService.clearAll();
    cardService.clearAll();
    res.json({ success: true, message: 'All simulation data cleared' });
});

// POST /api/settings/ttl
router.post('/ttl', (req, res) => {
    const { service, ttl } = req.body; // ttl in ms
    if (!ttl || ttl < 1000) return res.status(400).json({ error: 'Invalid TTL' });

    switch (service) {
        case 'email':
            inboxService.setTTL(ttl);
            break;
        case 'phone':
            smsService.setTTL(ttl);
            break;
        case 'card':
            cardService.setTTL(ttl);
            break;
        default:
            return res.status(400).json({ error: 'Invalid service' });
    }
    res.json({ success: true, service, ttl });
});

module.exports = router;
