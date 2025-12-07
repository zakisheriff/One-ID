const express = require('express');
const router = express.Router();
const inboxService = require('../services/inboxService');
const socketService = require('../services/socketService');

// All routes use query parameters to match client API and Vercel functions
// GET /api/email?action=messages&address=...
// POST /api/email?action=new
// POST /api/email?action=sync&address=...
// DELETE /api/email?action=delete&address=...

router.all('/', async (req, res) => {
    const { action, address } = req.query;

    try {
        switch (action) {
            case 'new':
                // POST /api/email?action=new
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                const address = await inboxService.generateAddress();
                return res.status(200).json({ address });

            case 'sync':
                // POST /api/email?action=sync&address=...
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!address) {
                    return res.status(400).json({ error: 'Address required' });
                }
                const syncResult = await inboxService.syncMessages(address);
                return res.status(200).json(syncResult);

            case 'messages':
                // GET /api/email?action=messages&address=...
                if (req.method !== 'GET') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!address) {
                    return res.status(400).json({ error: 'Address required' });
                }
                const messages = await inboxService.getMessages(address);
                return res.status(200).json({ messages });

            case 'delete':
                // DELETE /api/email?action=delete&address=...
                if (req.method !== 'DELETE') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!address) {
                    return res.status(400).json({ error: 'Address required' });
                }
                await inboxService.deleteAddress(address);
                return res.status(200).json({ success: true });

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('[Email Route Error]:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error',
            details: error.toString()
        });
    }
});

module.exports = router;

