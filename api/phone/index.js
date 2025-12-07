// Vercel Serverless Function - Phone API
const smsService = require('../_lib/smsService');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action, number } = req.query;

    try {
        switch (action) {
            case 'new':
                // POST /api/phone?action=new
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                const result = await smsService.generateNumber();
                return res.status(200).json(result);

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
                const message = await smsService.simulateIncoming(number);
                return res.status(200).json(message);

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('[Phone API Error]:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
