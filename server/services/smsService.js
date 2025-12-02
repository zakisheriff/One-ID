const { v4: uuidv4 } = require('uuid');

class SmsService {
    constructor() {
        this.numbers = new Map(); // Map<phoneNumber, { messages: [], createdAt: Date }>
        this.ttl = 10 * 60 * 1000; // 10 minutes default

        // Twilio Configuration
        this.accountSid = process.env.TWILIO_ACCOUNT_SID;
        this.authToken = process.env.TWILIO_AUTH_TOKEN;
        this.twilioNumber = process.env.TWILIO_PHONE_NUMBER;

        this.client = null;
        this.isReal = false;

        if (this.accountSid && this.authToken && this.twilioNumber) {
            try {
                this.client = twilio(this.accountSid, this.authToken);
                this.isReal = true;
                console.log('✅ Twilio SMS Service Initialized');
            } catch (error) {
                console.error('❌ Twilio Initialization Failed:', error.message);
            }
        } else {
            console.log('⚠️ Twilio credentials missing. Using SMS Simulation.');
        }
    }

    // Generate a phone number
    async generateNumber() {
        if (this.isReal) {
            // In a real app with one Twilio number, we just return that number.
            // A more complex app would buy new numbers via API, but that costs money per number.
            // For this "Production Level" demo, we share the single Twilio number.
            const number = this.twilioNumber;
            this.createInbox(number);
            return number;
        } else {
            // Simulation (Sri Lanka)
            // +94 7X XXX XXXX
            const number = `+947${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
            this.createInbox(number);
            return number;
        }
    }

    createInbox(number) {
        if (!this.numbers.has(number)) {
            this.numbers.set(number, {
                messages: [],
                createdAt: new Date()
            });

            // Auto-delete number after TTL
            setTimeout(() => {
                this.deleteNumber(number);
            }, this.ttl);
        }
    }

    // Get messages for a number
    async getMessages(number) {
        if (this.isReal) {
            try {
                // Fetch real messages from Twilio
                const messages = await this.client.messages.list({
                    to: number,
                    limit: 20
                });

                return messages.map(msg => ({
                    id: msg.sid,
                    from: msg.from,
                    body: msg.body,
                    timestamp: msg.dateCreated,
                    read: false
                }));
            } catch (error) {
                console.error('Twilio Fetch Error:', error);
                return [];
            }
        } else {
            // Simulation
            const inbox = this.numbers.get(number);
            return inbox ? inbox.messages : [];
        }
    }

    // Send a message (Simulation only for now, or real if needed)
    async sendMessage(to, from, body) {
        if (this.isReal) {
            // We can implement real sending too
            try {
                const msg = await this.client.messages.create({
                    body: body,
                    from: this.twilioNumber,
                    to: to // In this demo, 'to' is usually the user's virtual number, so we can't send TO ourselves easily without 2 numbers.
                    // But if 'to' is an external number, this works.
                });
                return {
                    id: msg.sid,
                    timestamp: msg.dateCreated,
                    body: msg.body,
                    from: msg.from
                };
            } catch (error) {
                console.error('Twilio Send Error:', error);
                throw error;
            }
        } else {
            // Simulation logic
            const message = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                from,
                body,
                read: false
            };
            this.addMessage(to, message);
            return message;
        }
    }

    addMessage(number, message) {
        if (this.numbers.has(number)) {
            this.numbers.get(number).messages.push(message);
        }
    }

    deleteNumber(number) {
        this.numbers.delete(number);
    }

    getActiveNumbers() {
        return Array.from(this.numbers.keys());
    }

    clearAll() {
        this.numbers.clear();
    }
}

module.exports = new SmsService();
