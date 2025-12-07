// Email service with Mail.tm + Supabase integration
const axios = require('axios');
const { getSupabaseClient } = require('./supabase');

class InboxService {
    constructor() {
        this.baseUrl = 'https://api.mail.tm';
        this.domain = '';
        this.ttl = 10 * 60 * 1000; // 10 minutes default
    }

    async initDomain() {
        if (this.domain) return this.domain;

        try {
            const response = await axios.get(`${this.baseUrl}/domains`);
            const domains = response.data['hydra:member'];
            if (domains && domains.length > 0) {
                this.domain = domains[0].domain;
                console.log(`[Mail.tm] Using domain: ${this.domain}`);
            }
            return this.domain;
        } catch (error) {
            console.error('[Mail.tm] Failed to fetch domains:', error.message);
            throw error;
        }
    }

    async generateAddress() {
        const supabase = getSupabaseClient();
        await this.initDomain();

        const username = Math.random().toString(36).substring(2, 12);
        const password = Math.random().toString(36).substring(2, 15);
        const address = `${username}@${this.domain}`;

        try {
            // Create account on Mail.tm
            const response = await axios.post(`${this.baseUrl}/accounts`, {
                address: address,
                password: password
            });

            // Get JWT token
            const tokenResponse = await axios.post(`${this.baseUrl}/token`, {
                address: address,
                password: password
            });

            // Store in Supabase
            const { data, error } = await supabase
                .from('email_addresses')
                .insert([{
                    address: address,
                    mail_tm_id: response.data.id,
                    mail_tm_token: tokenResponse.data.token,
                    expires_at: new Date(Date.now() + this.ttl).toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            console.log(`[Mail.tm] Created account: ${address}`);
            return { address, expiresAt: data.expires_at };
        } catch (error) {
            console.error('[Mail.tm] Failed to create account:', error.message);
            throw new Error('Failed to generate email address');
        }
    }

    async syncMessages(address) {
        const supabase = getSupabaseClient();

        try {
            // Get email record from Supabase
            const { data: emailData, error: emailError } = await supabase
                .from('email_addresses')
                .select('mail_tm_token, mail_tm_id')
                .eq('address', address)
                .eq('deleted', false)
                .single();

            if (emailError || !emailData) {
                throw new Error('Email address not found');
            }

            // Fetch messages from Mail.tm
            const response = await axios.get(`${this.baseUrl}/messages`, {
                headers: { Authorization: `Bearer ${emailData.mail_tm_token}` }
            });

            let remoteMessages = response.data['hydra:member'] || response.data;
            if (!Array.isArray(remoteMessages)) {
                remoteMessages = [];
            }

            // Get existing message IDs from Supabase
            const { data: existingMessages } = await supabase
                .from('email_messages')
                .select('remote_id')
                .eq('address', address);

            const existingIds = new Set(existingMessages?.map(m => m.remote_id) || []);

            // Process new messages
            const newMessages = [];
            for (const msg of remoteMessages) {
                if (!existingIds.has(msg.id)) {
                    // Fetch full message details
                    const fullMsgResponse = await axios.get(`${this.baseUrl}/messages/${msg.id}`, {
                        headers: { Authorization: `Bearer ${emailData.mail_tm_token}` }
                    });

                    const fullMsg = fullMsgResponse.data;

                    newMessages.push({
                        address: address,
                        remote_id: msg.id,
                        from_address: `${fullMsg.from.name || ''} <${fullMsg.from.address}>`,
                        subject: fullMsg.subject || '(No subject)',
                        body: fullMsg.html || fullMsg.text || 'No content',
                        text_body: fullMsg.text,
                        timestamp: fullMsg.createdAt
                    });
                }
            }

            // Insert new messages into Supabase
            if (newMessages.length > 0) {
                const { error: insertError } = await supabase
                    .from('email_messages')
                    .insert(newMessages);

                if (insertError) {
                    console.error('[Supabase] Failed to insert messages:', insertError);
                }

                console.log(`[Mail.tm] Synced ${newMessages.length} new messages for ${address}`);
            }

            return { synced: newMessages.length };
        } catch (error) {
            console.error(`[Mail.tm] Failed to sync messages for ${address}:`, error.message);
            throw error;
        }
    }

    async getMessages(address) {
        const supabase = getSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('email_messages')
                .select('*')
                .eq('address', address)
                .order('timestamp', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('[Supabase] Failed to get messages:', error.message);
            throw error;
        }
    }

    async deleteAddress(address) {
        const supabase = getSupabaseClient();

        try {
            // Soft delete
            const { error } = await supabase
                .from('email_addresses')
                .update({ deleted: true })
                .eq('address', address);

            if (error) throw error;

            console.log(`[Supabase] Deleted email: ${address}`);
            return { success: true };
        } catch (error) {
            console.error('[Supabase] Failed to delete email:', error.message);
            throw error;
        }
    }

    async clearAll() {
        const supabase = getSupabaseClient();

        try {
            // Soft delete all
            await supabase
                .from('email_addresses')
                .update({ deleted: true })
                .eq('deleted', false);

            console.log('[Supabase] Cleared all emails');
            return { success: true };
        } catch (error) {
            console.error('[Supabase] Failed to clear emails:', error.message);
            throw error;
        }
    }
}

module.exports = new InboxService();
