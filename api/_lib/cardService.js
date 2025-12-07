// Card service with Supabase integration
const { getSupabaseClient } = require('./supabase');

class CardService {
    constructor() {
        this.ttl = 24 * 60 * 60 * 1000; // 24 hours default
    }

    _generateCardNumber() {
        // Generate Luhn-valid card number
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

    async generateCard() {
        const supabase = getSupabaseClient();

        const cardData = {
            card_number: this._generateCardNumber(),
            expiry: this._generateExpiry(),
            cvv: Math.floor(Math.random() * 900 + 100).toString(),
            holder: 'One ID User',
            card_limit: 5000,
            locked: false,
            is_real: false,
            expires_at: new Date(Date.now() + this.ttl).toISOString()
        };

        try {
            const { data, error } = await supabase
                .from('virtual_cards')
                .insert([cardData])
                .select()
                .single();

            if (error) throw error;

            console.log(`[Card] Generated card: ${data.id}`);
            return data;
        } catch (error) {
            console.error('[Card] Failed to generate card:', error.message);
            throw error;
        }
    }

    async getCard(cardId) {
        const supabase = getSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('virtual_cards')
                .select('*')
                .eq('id', cardId)
                .eq('deleted', false)
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('[Card] Failed to get card:', error.message);
            throw error;
        }
    }

    async toggleLock(cardId) {
        const supabase = getSupabaseClient();

        try {
            // Get current lock status
            const card = await this.getCard(cardId);

            // Toggle lock
            const { data, error } = await supabase
                .from('virtual_cards')
                .update({ locked: !card.locked })
                .eq('id', cardId)
                .select()
                .single();

            if (error) throw error;

            console.log(`[Card] Toggled lock for ${cardId}: ${data.locked}`);
            return data;
        } catch (error) {
            console.error('[Card] Failed to toggle lock:', error.message);
            throw error;
        }
    }

    async getTransactions(cardId) {
        const supabase = getSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('card_transactions')
                .select('*')
                .eq('card_id', cardId)
                .order('timestamp', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('[Card] Failed to get transactions:', error.message);
            throw error;
        }
    }

    async addTransaction(cardId, transaction) {
        const supabase = getSupabaseClient();

        try {
            // Check if card is locked
            const card = await this.getCard(cardId);
            if (card.locked) {
                throw new Error('Card is locked');
            }

            const { data, error } = await supabase
                .from('card_transactions')
                .insert([{
                    card_id: cardId,
                    merchant: transaction.merchant || 'Unknown Merchant',
                    amount: transaction.amount || 0,
                    currency: transaction.currency || 'USD',
                    status: 'approved',
                    timestamp: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            console.log(`[Card] Added transaction to ${cardId}`);
            return data;
        } catch (error) {
            console.error('[Card] Failed to add transaction:', error.message);
            throw error;
        }
    }

    async deleteCard(cardId) {
        const supabase = getSupabaseClient();

        try {
            const { error } = await supabase
                .from('virtual_cards')
                .update({ deleted: true })
                .eq('id', cardId);

            if (error) throw error;

            console.log(`[Card] Deleted card: ${cardId}`);
            return { success: true };
        } catch (error) {
            console.error('[Card] Failed to delete card:', error.message);
            throw error;
        }
    }

    async clearAll() {
        const supabase = getSupabaseClient();

        try {
            await supabase
                .from('virtual_cards')
                .update({ deleted: true })
                .eq('deleted', false);

            console.log('[Card] Cleared all cards');
            return { success: true };
        } catch (error) {
            console.error('[Card] Failed to clear cards:', error.message);
            throw error;
        }
    }

    // Simulate transaction (for testing)
    async simulateTransaction(cardId) {
        const merchants = ['PickMe', 'Uber Eats', 'Daraz', 'FoodCity', 'Keells Super', 'Odel'];

        const transaction = {
            merchant: merchants[Math.floor(Math.random() * merchants.length)],
            amount: (Math.random() * 100).toFixed(2),
            currency: 'USD'
        };

        return await this.addTransaction(cardId, transaction);
    }
}

module.exports = new CardService();
