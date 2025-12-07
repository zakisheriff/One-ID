const express = require('express');
const router = express.Router();
const inboxService = require('../services/inboxService');
const smsService = require('../services/smsService');
const cardService = require('../services/cardService');

// All routes use query parameters to match client API and Vercel functions
// POST /api/settings?action=clear

router.all('/', (req, res) => {
    const { action } = req.query;

    try {
        switch (action) {
            case 'clear':
                // POST /api/settings?action=clear
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                inboxService.clearAll();
                smsService.clearAll();
                cardService.clearAll();
                return res.status(200).json({ success: true, message: 'All simulation data cleared' });

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('[Settings Route Error]:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error',
            details: error.toString()
        });
    }
});

module.exports = router;

