// Email service with 1secmail + Supabase integration
const axios = require('axios');
const { getSupabaseClient } = require('./supabase');

class InboxService {
    constructor() {
        this.baseUrl = 'https://www.1secmail.com/api/v1/';
        this.ttl = 10 * 60 * 1000; // 10 minutes default
        this.domains = ['1secmail.com', '1secmail.org', '1secmail.net'];
    }

    async generateAddress() {
        const supabase = getSupabaseClient();

        // Generate random username
        const username = Math.random().toString(36).substring(2, 12);
        const domain = this.domains[Math.floor(Math.random() * this.domains.length)];
        const address = `${username}@${domain}`;

        try {
            console.log(`[1secmail] Creating email address: ${address}`);

            // 1secmail doesn't require account creation - just use the address
            // Store in Supabase
            const { data, error } = await supabase
                .from('email_addresses')
                .insert([{
                    address: address,
                    mail_tm_id: null,
                    mail_tm_token: null,
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
            console.error('[1secmail] Failed to create address:', error.message);
            throw new Error(`Failed to generate email address: ${error.message}`);
        }
    }

    async syncMessages(address) {
        const supabase = getSupabaseClient();

        try {
            // Parse email address
            const [username, domain] = address.split('@');

            console.log(`[1secmail] Syncing messages for: ${address}`);
            console.log(`[1secmail] Username: ${username}, Domain: ${domain}`);

            // Fetch messages from 1secmail
            console.log(`[1secmail] Fetching messages from API...`);
            const response = await axios.get(this.baseUrl, {
                params: {
                    action: 'getMessages',
                    login: username,
                    domain: domain
                }
            });

            const remoteMessages = response.data || [];
            console.log(`[1secmail] Found ${remoteMessages.length} messages`);

            if (remoteMessages.length === 0) {
                console.log(`[1secmail] No messages to sync`);
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

            const existingIds = new Set(existingMessages?.map(m => m.remote_id?.toString()) || []);
            console.log(`[Supabase] Found ${existingIds.size} existing messages`);

            // Process new messages
            const newMessages = [];
            for (const msg of remoteMessages) {
                if (!existingIds.has(msg.id.toString())) {
                    console.log(`[1secmail] Fetching full message ${msg.id}...`);

                    // Fetch full message details
                    const fullMsgResponse = await axios.get(this.baseUrl, {
                        params: {
                            action: 'readMessage',
                            login: username,
                            domain: domain,
                            id: msg.id
                        }
                    });

                    const fullMsg = fullMsgResponse.data;
                    console.log(`[1secmail] Got full message:`, {
                        from: fullMsg.from,
                        subject: fullMsg.subject,
                        date: msg.date
                    });

                    newMessages.push({
                        address: address,
                        remote_id: msg.id.toString(),
                        from_address: fullMsg.from || msg.from || 'Unknown',
                        subject: fullMsg.subject || msg.subject || '(No subject)',
                        body: fullMsg.htmlBody || fullMsg.textBody || fullMsg.body || 'No content',
                        text_body: fullMsg.textBody || fullMsg.body,
                        timestamp: new Date(msg.date).toISOString()
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
                    console.error('[Supabase] Insert error details:', JSON.stringify(insertError, null, 2));
                    throw insertError;
                }

                console.log(`[1secmail] Successfully synced ${newMessages.length} new messages for ${address}`);
            } else {
                console.log(`[1secmail] No new messages to insert`);
            }

            return { synced: newMessages.length };
        } catch (error) {
            console.error(`[1secmail] Failed to sync messages for ${address}:`, error.message);
            console.error(`[1secmail] Error stack:`, error.stack);
            console.error(`[1secmail] Error details:`, {
                name: error.name,
                message: error.message,
                code: error.code,
                response: error.response?.data
            });
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
