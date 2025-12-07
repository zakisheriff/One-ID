// SMS service with Supabase integration
const { getSupabaseClient } = require('./supabase');

class SmsService {
    constructor() {
        this.ttl = 10 * 60 * 1000; // 10 minutes default
    }

    async generateNumber() {
        const supabase = getSupabaseClient();

        // Generate random phone number (US format)
        const areaCode = Math.floor(Math.random() * 900) + 100;
        const prefix = Math.floor(Math.random() * 900) + 100;
        const lineNumber = Math.floor(Math.random() * 9000) + 1000;
        const number = `+1${areaCode}${prefix}${lineNumber}`;

        try {
            const { data, error } = await supabase
                .from('phone_numbers')
                .insert([{
                    number: number,
                    expires_at: new Date(Date.now() + this.ttl).toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            console.log(`[SMS] Generated number: ${number}`);
            return { number, expiresAt: data.expires_at };
        } catch (error) {
            console.error('[SMS] Failed to generate number:', error.message);
            throw error;
        }
    }

    async getMessages(number) {
        const supabase = getSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('sms_messages')
                .select('*')
                .eq('number', number)
                .order('timestamp', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('[SMS] Failed to get messages:', error.message);
            throw error;
        }
    }

    async addMessage(number, message) {
        const supabase = getSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('sms_messages')
                .insert([{
                    number: number,
                    from_sender: message.from || 'System',
                    body: message.body || 'Test message',
                    timestamp: message.timestamp || new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            console.log(`[SMS] Added message to ${number}`);
            return data;
        } catch (error) {
            console.error('[SMS] Failed to add message:', error.message);
            throw error;
        }
    }

    async deleteNumber(number) {
        const supabase = getSupabaseClient();

        try {
            const { error } = await supabase
                .from('phone_numbers')
                .update({ deleted: true })
                .eq('number', number);

            if (error) throw error;

            console.log(`[SMS] Deleted number: ${number}`);
            return { success: true };
        } catch (error) {
            console.error('[SMS] Failed to delete number:', error.message);
            throw error;
        }
    }

    async clearAll() {
        const supabase = getSupabaseClient();

        try {
            await supabase
                .from('phone_numbers')
                .update({ deleted: true })
                .eq('deleted', false);

            console.log('[SMS] Cleared all numbers');
            return { success: true };
        } catch (error) {
            console.error('[SMS] Failed to clear numbers:', error.message);
            throw error;
        }
    }

    // Simulate incoming SMS (for testing)
    async simulateIncoming(number) {
        const senders = ['PickMe', 'Uber', 'Daraz', 'Dialog', 'Mobitel', 'Sampath Bank'];
        const bodies = [
            'Your verification code is 84920.',
            'Your package is out for delivery.',
            'Rs. 5,000 debited from card ending 1234.',
            'You have used 80% of your data bundle.',
            'Your ride code is 4432.',
            'Your order #4492 is ready for pickup.'
        ];

        const message = {
            from: senders[Math.floor(Math.random() * senders.length)],
            body: bodies[Math.floor(Math.random() * bodies.length)],
            timestamp: new Date().toISOString()
        };

        return await this.addMessage(number, message);
    }
}

module.exports = new SmsService();
