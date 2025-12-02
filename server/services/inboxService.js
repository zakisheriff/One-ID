const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class InboxService {
    constructor() {
        this.inboxes = new Map(); // address -> { token, id, createdAt, messages: [] }
        this.baseUrl = 'https://api.mail.tm';
        this.domain = '';
        this.initDomain();
    }

    async initDomain() {
        try {
            const response = await axios.get(`${this.baseUrl}/domains`);
            // Pick a random domain
            const domains = response.data['hydra:member'];
            if (domains && domains.length > 0) {
                this.domain = domains[0].domain;
                console.log(`[Mail.tm] Using domain: ${this.domain}`);
            }
        } catch (error) {
            console.error('[Mail.tm] Failed to fetch domains:', error.message);
        }
    }

    async generateAddress() {
        if (!this.domain) await this.initDomain();

        const username = Math.random().toString(36).substring(2, 12);
        const password = uuidv4(); // Random password
        const address = `${username}@${this.domain}`;

        try {
            const response = await axios.post(`${this.baseUrl}/accounts`, {
                address: address,
                password: password
            });

            // Get JWT token
            const tokenResponse = await axios.post(`${this.baseUrl}/token`, {
                address: address,
                password: password
            });

            this.inboxes.set(address, {
                id: response.data.id,
                token: tokenResponse.data.token,
                createdAt: Date.now(),
                messages: []
            });

            console.log(`[Mail.tm] Created account: ${address}`);
            return address;
        } catch (error) {
            console.error('[Mail.tm] Failed to create account:', error.message);
            throw new Error('Failed to generate email address');
        }
    }

    async checkNewMessages(address, socketService) {
        const inbox = this.inboxes.get(address);
        if (!inbox) return;

        try {
            const response = await axios.get(`${this.baseUrl}/messages`, {
                headers: { Authorization: `Bearer ${inbox.token}` }
            });

            const remoteMessages = response.data['hydra:member'];

            // Filter new messages
            for (const msg of remoteMessages) {
                const exists = inbox.messages.find(m => m.remoteId === msg.id);
                if (!exists) {
                    // Fetch full message details for body
                    const fullMsgResponse = await axios.get(`${this.baseUrl}/messages/${msg.id}`, {
                        headers: { Authorization: `Bearer ${inbox.token}` }
                    });

                    const fullMsg = fullMsgResponse.data;

                    const newMessage = {
                        id: uuidv4(),
                        remoteId: msg.id,
                        from: `${fullMsg.from.name || ''} <${fullMsg.from.address}>`,
                        subject: fullMsg.subject,
                        body: fullMsg.html || fullMsg.text || 'No content',
                        text: fullMsg.text, // Keep text version for preview/parsing
                        timestamp: fullMsg.createdAt,
                        read: false
                    };

                    inbox.messages.unshift(newMessage);
                    socketService.emitEmail(address, newMessage);
                    console.log(`[Mail.tm] New email for ${address}: ${newMessage.subject}`);
                }
            }
        } catch (error) {
            console.error(`[Mail.tm] Failed to check messages for ${address}:`, error.message);
        }
    }

    getActiveAddresses() {
        return Array.from(this.inboxes.keys());
    }

    getMessages(address) {
        const inbox = this.inboxes.get(address);
        return inbox ? inbox.messages : [];
    }

    // ... other methods can remain or be stubbed if not used by real impl
    createInbox(address) { /* No-op for real service */ }
    addMessage(address, message) { /* No-op, we only receive real ones */ }

    deleteMessage(address, messageId) {
        const inbox = this.inboxes.get(address);
        if (inbox) {
            inbox.messages = inbox.messages.filter(m => m.id !== messageId);
        }
    }

    clearAll() {
        this.inboxes.clear();
    }
}

module.exports = new InboxService();
