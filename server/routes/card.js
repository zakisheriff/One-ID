const express = require('express');
const router = express.Router();
const cardService = require('../services/cardService');
const socketService = require('../services/socketService');

// All routes use query parameters to match client API and Vercel functions
// POST /api/card?action=new
// GET /api/card?action=get&id=...
// POST /api/card?action=lock&id=...
// GET /api/card?action=transactions&id=...
// POST /api/card?action=simulate&id=...

router.all('/', async (req, res) => {
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
                if (cardData) {
                    return res.status(200).json(cardData);
                } else {
                    return res.status(404).json({ error: 'Card not found' });
                }

            case 'lock':
                // POST /api/card?action=lock&id=...
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                if (!id) {
                    return res.status(400).json({ error: 'Card ID required' });
                }
                const lockedCard = await cardService.toggleLock(id);
                if (lockedCard) {
                    return res.status(200).json(lockedCard);
                } else {
                    return res.status(404).json({ error: 'Card not found' });
                }

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
                if (transaction) {
                    socketService.emitTransaction(id, transaction);
                    return res.status(200).json(transaction);
                } else {
                    return res.status(404).json({ error: 'Card not found or locked' });
                }

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('[Card Route Error]:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error',
            details: error.toString()
        });
    }
});

module.exports = router;

