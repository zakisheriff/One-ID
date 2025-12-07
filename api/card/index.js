// Vercel Serverless Function - Card API
const cardService = require('../_lib/cardService');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action, id } = req.query;

    try {
        switch (action) {
            case 'new':
                // POST /api/card?action=new
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                const card = await cardService.generateCard();
                return res.status(200).json(card);

            case 'get':
                // GET /api/card?action=get&id=...
                if (req.method !== 'GET') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!id) {
                    return res.status(400).json({ error: 'Card ID required' });
                }
                const cardData = await cardService.getCard(id);
                return res.status(200).json(cardData);

            case 'lock':
                // POST /api/card?action=lock&id=...
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!id) {
                    return res.status(400).json({ error: 'Card ID required' });
                }
                const updatedCard = await cardService.toggleLock(id);
                return res.status(200).json(updatedCard);

            case 'transactions':
                // GET /api/card?action=transactions&id=...
                if (req.method !== 'GET') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!id) {
                    return res.status(400).json({ error: 'Card ID required' });
                }
                const transactions = await cardService.getTransactions(id);
                return res.status(200).json({ transactions });

            case 'simulate':
                // POST /api/card?action=simulate&id=...
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!id) {
                    return res.status(400).json({ error: 'Card ID required' });
                }
                const transaction = await cardService.simulateTransaction(id);
                return res.status(200).json(transaction);

            case 'delete':
                // DELETE /api/card?action=delete&id=...
                if (req.method !== 'DELETE') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!id) {
                    return res.status(400).json({ error: 'Card ID required' });
                }
                await cardService.deleteCard(id);
                return res.status(200).json({ success: true });

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('[Card API Error]:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
