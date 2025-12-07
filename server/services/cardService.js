const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');

class CardService {
    constructor() {
        this.cards = new Map(); // cardId -> { details, transactions: [] }
        this.ttl = 24 * 60 * 60 * 1000; // 24 hours default for cards

        // Stripe Configuration
        this.stripeKey = process.env.STRIPE_SECRET_KEY;
        this.stripe = null;
        this.isReal = false;

        if (this.stripeKey) {
            try {
                this.stripe = Stripe(this.stripeKey);
                this.isReal = true;
                console.log('✅ Stripe Card Service Initialized');
            } catch (error) {
                console.error('❌ Stripe Initialization Failed:', error.message);
            }
        } else {
            console.log('⚠️ Stripe credentials missing. Using Card Simulation.');
        }
    }

    setTTL(milliseconds) {
        this.ttl = milliseconds;
    }

    async generateCard() {
        if (this.isReal) {
            try {
                // Create a cardholder first (required for issuing)
                const cardholder = await this.stripe.issuing.cardholders.create({
                    name: 'One ID User',
                    email: 'user@oneid.lab',
                    status: 'active',
                    type: 'individual',
                    billing: {
                        address: {
                            line1: '123 Fake St',
                            city: 'San Francisco',
                            state: 'CA',
                            postal_code: '94111',
                            country: 'US',
                        },
                    },
                });

                // Create a virtual card
                const card = await this.stripe.issuing.cards.create({
                    cardholder: cardholder.id,
                    currency: 'usd',
                    type: 'virtual',
                    status: 'active',
                });

                // Fetch details (number/cvv/expiry) - In test mode, details are available immediately via API or UI
                // Note: Stripe API hides full number by default for security. 
                // For this demo, we might only get last4 unless we use specific PCI-compliant endpoints.
                // However, for "Test Mode", we can often see details in dashboard or use test numbers.
                // To keep it simple for this hybrid approach:
                // We will store the Stripe ID but might have to simulate the DISPLAY of the full number 
                // if the API doesn't return it (which it usually doesn't for security).

                const fullCard = {
                    id: card.id,
                    stripeId: card.id,
                    number: `**** **** **** ${card.last4}`, // Real API masks this
                    expiry: `${card.exp_month.toString().padStart(2, '0')}/${card.exp_year.toString().slice(-2)}`,
                    cvv: '***', // Real API masks this
                    holder: cardholder.name,
                    limit: 5000,
                    locked: false,
                    createdAt: Date.now(),
                    transactions: [],
                    isReal: true
                };

                this.cards.set(card.id, fullCard);
                return fullCard;

            } catch (error) {
                console.error('Stripe Create Card Error:', error);
                // Fallback to simulation if API fails
                return this._createSimulatedCard();
            }
        } else {
            return this._createSimulatedCard();
        }
    }

    _createSimulatedCard() {
        const cardId = uuidv4();
        const card = {
            id: cardId,
            number: this._generateCardNumber(),
            expiry: this._generateExpiry(),
            cvv: Math.floor(Math.random() * 900 + 100).toString(),
            holder: 'Safe Identity User',
            limit: 5000,
            locked: false,
            createdAt: Date.now(),
            transactions: [],
            isReal: false
        };

        this.cards.set(cardId, card);

        // Auto-expire card
        setTimeout(() => {
            this.deleteCard(cardId);
        }, this.ttl);

        return card;
    }

    _generateCardNumber() {
        // Simple 4242 generator for demo
        const parts = [];
        for (let i = 0; i < 4; i++) {
            parts.push(Math.floor(Math.random() * 9000 + 1000).toString());
        }
        return parts.join(' ');
    }

    _generateExpiry() {
        const now = new Date();
        const year = now.getFullYear() + Math.floor(Math.random() * 3) + 1;
        const month = Math.floor(Math.random() * 12) + 1;
        return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
    }

    getCard(cardId) {
        return this.cards.get(cardId);
    }

    async regenerateCard(cardId) {
        const card = this.cards.get(cardId);
        if (!card) return null;

        if (card.isReal) {
            // Real cards cannot just "regenerate" numbers easily without canceling and reissuing.
            // For this demo, we'll just return the existing card or implement reissue logic if needed.
            return card;
        } else {
            card.number = this._generateCardNumber();
            card.expiry = this._generateExpiry();
            card.cvv = Math.floor(Math.random() * 900 + 100).toString();
            return card;
        }
    }

    async toggleLock(cardId) {
        const card = this.cards.get(cardId);
        if (!card) return null;

        if (card.isReal) {
            try {
                const newStatus = card.locked ? 'active' : 'inactive';
                const updated = await this.stripe.issuing.cards.update(card.stripeId, {
                    status: newStatus
                });
                card.locked = updated.status === 'inactive';
                return card;
            } catch (error) {
                console.error('Stripe Lock Error:', error);
                return card;
            }
        } else {
            card.locked = !card.locked;
            return card;
        }
    }

    addTransaction(cardId, transaction) {
        const card = this.cards.get(cardId);
        if (!card || card.locked) return null;

        const fullTransaction = {
            id: uuidv4(),
            date: new Date().toISOString(),
            status: 'approved',
            ...transaction
        };

        card.transactions.unshift(fullTransaction);
        return fullTransaction;
    }

    async getTransactions(cardId) {
        const card = this.cards.get(cardId);
        if (!card) return [];

        if (card.isReal) {
            try {
                // Fetch real authorizations
                const authorizations = await this.stripe.issuing.authorizations.list({
                    card: card.stripeId,
                    limit: 10
                });

                // Merge real transactions with any local ones (if any)
                const realTx = authorizations.data.map(auth => ({
                    id: auth.id,
                    merchant: auth.merchant_data.name,
                    amount: auth.amount / 100, // Stripe is in cents
                    date: new Date(auth.created * 1000).toISOString(),
                    status: auth.status
                }));

                return realTx;
            } catch (error) {
                console.error('Stripe Transaction Fetch Error:', error);
                return card.transactions;
            }
        } else {
            return card.transactions;
        }
    }

    deleteCard(cardId) {
        this.cards.delete(cardId);
    }

    getActiveCards() {
        return Array.from(this.cards.values());
    }

    clearAll() {
        this.cards.clear();
    }
}

module.exports = new CardService();
