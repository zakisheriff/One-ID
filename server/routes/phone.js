const express = require('express');
const router = express.Router();
const smsService = require('../services/smsService');
const socketService = require('../services/socketService');

// All routes use query parameters to match client API and Vercel functions
// POST /api/phone?action=new
// GET /api/phone?action=messages&number=...
// DELETE /api/phone?action=delete&number=...
// POST /api/phone?action=simulate&number=...

router.all('/', async (req, res) => {
    const { action, number } = req.query;

    try {
        switch (action) {
            case 'new':
                // POST /api/phone?action=new
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                const number = await smsService.generateNumber();
                return res.status(200).json({ number });

            case 'messages':
                // GET /api/phone?action=messages&number=...
                if (req.method !== 'GET') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!number) {
                    return res.status(400).json({ error: 'Number required' });
                }
                const messages = await smsService.getMessages(number);
                return res.status(200).json({ messages });

            case 'delete':
                // DELETE /api/phone?action=delete&number=...
                if (req.method !== 'DELETE') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!number) {
                    return res.status(400).json({ error: 'Number required' });
                }
                await smsService.deleteNumber(number);
                return res.status(200).json({ success: true });

            case 'simulate':
                // POST /api/phone?action=simulate&number=...
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!number) {
                    return res.status(400).json({ error: 'Number required' });
                }
                const { body, from } = req.body;
                const message = smsService.addMessage(number, {
                    body: body || 'Test message',
                    from: from || 'System',
                    timestamp: new Date().toISOString()
                });
                socketService.emitSms(number, message);
                return res.status(200).json(message);

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('[Phone Route Error]:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error',
            details: error.toString()
        });
    }
});

module.exports = router;

