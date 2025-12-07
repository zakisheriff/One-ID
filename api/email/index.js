// Vercel Serverless Function - Email API
const inboxService = require('../_lib/inboxService');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action, address } = req.query;

    try {
        switch (action) {
            case 'new':
                // POST /api/email?action=new
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                const result = await inboxService.generateAddress();
                return res.status(200).json(result);

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
        console.error('[Email API Error]:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
