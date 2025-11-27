const express = require('express');
const router = express.Router();
const cardService = require('../services/cardService');
const socketService = require('../services/socketService');

// POST /api/card/new
router.post('/new', async (req, res) => {
    try {
        const card = await cardService.generateCard();
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/card/:id/regenerate
router.post('/:id/regenerate', async (req, res) => {
    try {
        const card = await cardService.regenerateCard(req.params.id);
        if (card) {
            res.json(card);
        } else {
            res.status(404).json({ error: 'Card not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/card/:id/lock
router.post('/:id/lock', async (req, res) => {
    try {
        const card = await cardService.toggleLock(req.params.id);
        if (card) {
            res.json(card);
        } else {
            res.status(404).json({ error: 'Card not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/card/:id/transactions
router.get('/:id/transactions', async (req, res) => {
    try {
        const transactions = await cardService.getTransactions(req.params.id);
        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
