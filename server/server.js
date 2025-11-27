const express = require('express');
require('dotenv').config();
const http = require('http');
const cors = require('cors');
const socketService = require('./services/socketService');
const inboxService = require('./services/inboxService');
const smsService = require('./services/smsService');
const cardService = require('./services/cardService');

const emailRoutes = require('./routes/email');
const phoneRoutes = require('./routes/phone');
const cardRoutes = require('./routes/card');
const settingsRoutes = require('./routes/settings');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL || 'https://your-app.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

// Initialize Socket.io
socketService.init(server);

// Routes
app.use('/api/email', emailRoutes);
app.use('/api/phone', phoneRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/settings', settingsRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Imposter Server is running');
});

// --- Simulation Logic ---

const FAKE_DATA = {
    senders: ['Amazon', 'Netflix', 'Google', 'Apple', 'LinkedIn', 'Slack', 'Zoom'],
    subjects: ['Your order has shipped', 'Verify your email', 'Security Alert', 'New Login', 'Subscription Update'],
    bodies: ['Please click here to verify.', 'Your code is 123456.', 'Someone logged in from new device.', 'Your payment failed.'],
    smsBodies: ['Your verification code is 84920.', 'Your delivery is arriving soon.', 'Appointment confirmed for tomorrow.'],
    merchants: ['Uber', 'Starbucks', 'Amazon AWS', 'Target', 'Whole Foods', 'Steam'],
};

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Poll for Real Emails
setInterval(async () => {
    const addresses = inboxService.getActiveAddresses();
    for (const address of addresses) {
        await inboxService.checkNewMessages(address, socketService);
    }
}, 5000); // Check every 5 seconds

// Simulate Incoming SMS
setInterval(() => {
    const numbers = smsService.getActiveNumbers();
    if (numbers.length > 0) {
        const number = getRandom(numbers);
        const message = smsService.addMessage(number, {
            from: getRandom(FAKE_DATA.senders), // SMS sender ID
            body: getRandom(FAKE_DATA.smsBodies)
        });
        socketService.emitSms(number, message);
        console.log(`[SIM] SMS to ${number}`);
    }
}, Math.random() * 20000 + 20000); // 20-40s

// Simulate Card Transactions
setInterval(() => {
    const cards = cardService.getActiveCards();
    if (cards.length > 0) {
        const card = getRandom(cards);
        if (!card.locked) {
            const transaction = cardService.addTransaction(card.id, {
                merchant: getRandom(FAKE_DATA.merchants),
                amount: (Math.random() * 100).toFixed(2),
                currency: 'USD'
            });
            if (transaction) {
                socketService.emitTransaction(card.id, transaction);
                console.log(`[SIM] Transaction on ${card.id}`);
            }
        }
    }
}, Math.random() * 60000 + 30000); // 30-90s

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
