const { Server } = require('socket.io');

class SocketService {
    constructor() {
        this.io = null;
    }

    init(httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "*", // Allow all for demo
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('join-email', (address) => {
                socket.join(`email:${address}`);
            });

            socket.on('join-phone', (number) => {
                socket.join(`phone:${number}`);
            });

            socket.on('join-card', (cardId) => {
                socket.join(`card:${cardId}`);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    emitEmail(address, message) {
        if (this.io) {
            this.io.to(`email:${address}`).emit('new-email', message);
        }
    }

    emitSms(number, message) {
        if (this.io) {
            this.io.to(`phone:${number}`).emit('new-sms', message);
        }
    }

    emitTransaction(cardId, transaction) {
        if (this.io) {
            this.io.to(`card:${cardId}`).emit('new-transaction', transaction);
        }
    }
}

module.exports = new SocketService();
