// Email service with mail.gw + Supabase integration
const axios = require('axios');
const { getSupabaseClient } = require('./supabase');

class InboxService {
    constructor() {
        this.baseUrl = 'https://api.mail.gw';
        this.ttl = 10 * 60 * 1000; // 10 minutes default
    }

    async generateAddress() {
        const supabase = getSupabaseClient();

        try {
            console.log(`[mail.gw] Generating new email address...`);

            // Get available domain
            const domainResponse = await axios.get(`${this.baseUrl}/domains`);
            const domains = domainResponse.data['hydra:member'];
            if (!domains || domains.length === 0) {
                throw new Error('No domains available');
            }
            const domain = domains[0].domain;
            console.log(`[mail.gw] Using domain: ${domain}`);

            // Generate random username
            const username = Math.random().toString(36).substring(2, 12);
            const password = Math.random().toString(36).substring(2, 15);
            const address = `${username}@${domain}`;

            // Create account
            const accountResponse = await axios.post(`${this.baseUrl}/accounts`, {
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
                    mail_tm_id: accountResponse.data.id,
                    mail_tm_token: tokenResponse.data.token,
                    expires_at: new Date(Date.now() + this.ttl).toISOString()
                }])
                .select()
                .single();

            if (error) {
                console.error('[Supabase] Insert error:', error);
                throw error;
            }

            console.log(`[Success] Email created: ${address}`);
            return { address, expiresAt: data.expires_at };
        } catch (error) {
            console.error('[mail.gw] Failed to create address:', error.message);
            console.error('[mail.gw] Error response:', error.response?.data);
            throw new Error(`Failed to generate email address: ${error.message}`);
        }
    }

    async syncMessages(address) {
        const supabase = getSupabaseClient();

        try {
            console.log(`[mail.gw] Syncing messages for: ${address}`);

            // Get email record from Supabase
            const { data: emailData, error: emailError } = await supabase
                .from('email_addresses')
                .select('mail_tm_token, mail_tm_id')
                .eq('address', address)
                .eq('deleted', false)
                .single();

            if (emailError || !emailData) {
                console.error('[Supabase] Email not found:', emailError);
                throw new Error('Email address not found');
            }

            if (!emailData.mail_tm_token) {
                console.log('[mail.gw] No token available, skipping sync');
                return { synced: 0 };
            }

            // Fetch messages from mail.gw
            console.log(`[mail.gw] Fetching messages from API...`);
            const response = await axios.get(`${this.baseUrl}/messages`, {
                headers: { Authorization: `Bearer ${emailData.mail_tm_token}` }
            });

            const remoteMessages = response.data['hydra:member'] || [];
            console.log(`[mail.gw] Found ${remoteMessages.length} messages`);

            if (remoteMessages.length === 0) {
                console.log(`[mail.gw] No messages to sync`);
                return { synced: 0 };
            }

            // Get existing message IDs from Supabase
            console.log(`[Supabase] Checking for existing messages...`);
            const { data: existingMessages, error: selectError } = await supabase
                .from('email_messages')
                .select('remote_id')
                .eq('address', address);

            if (selectError) {
                console.error('[Supabase] Error fetching existing messages:', selectError);
                throw selectError;
            }

            const existingIds = new Set(existingMessages?.map(m => m.remote_id) || []);
            console.log(`[Supabase] Found ${existingIds.size} existing messages`);

            // Process new messages
            const newMessages = [];
            for (const msg of remoteMessages) {
                if (!existingIds.has(msg.id)) {
                    console.log(`[mail.gw] Fetching full message ${msg.id}...`);

                    // Fetch full message details
                    const fullMsgResponse = await axios.get(`${this.baseUrl}/messages/${msg.id}`, {
                        headers: { Authorization: `Bearer ${emailData.mail_tm_token}` }
                    });

                    const fullMsg = fullMsgResponse.data;
                    console.log(`[mail.gw] Got full message from:`, fullMsg.from.address);

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
                console.log(`[Supabase] Inserting ${newMessages.length} new messages...`);
                const { error: insertError } = await supabase
                    .from('email_messages')
                    .insert(newMessages);

                if (insertError) {
                    console.error('[Supabase] Failed to insert messages:', insertError);
                    throw insertError;
                }

                console.log(`[mail.gw] Successfully synced ${newMessages.length} new messages`);
            } else {
                console.log(`[mail.gw] No new messages to insert`);
            }

            return { synced: newMessages.length };
        } catch (error) {
            console.error(`[mail.gw] Failed to sync messages:`, error.message);
            console.error(`[mail.gw] Error details:`, error.response?.data);
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
