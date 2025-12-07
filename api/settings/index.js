// Vercel Serverless Function - Settings API
const inboxService = require('../_lib/inboxService');
const smsService = require('../_lib/smsService');
const cardService = require('../_lib/cardService');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action } = req.query;

    try {
        switch (action) {
            case 'clear':
                // POST /api/settings?action=clear
                await Promise.all([
                    inboxService.clearAll(),
                    smsService.clearAll(),
                    cardService.clearAll()
                ]);
                return res.status(200).json({ success: true, message: 'All data cleared' });

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('[Settings API Error]:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
