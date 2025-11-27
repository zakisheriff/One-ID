import { io } from 'socket.io-client';

// Auto-connects to the same host/port as the page served from (due to proxy in dev)
const socket = io('/', {
    autoConnect: false,
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export const joinRoom = (roomType, id) => {
    socket.emit(`join-${roomType}`, id);
};

export const onEmail = (callback) => {
    socket.on('new-email', callback);
    return () => socket.off('new-email', callback);
};

export const onSms = (callback) => {
    socket.on('new-sms', callback);
    return () => socket.off('new-sms', callback);
};

export const onTransaction = (callback) => {
    socket.on('new-transaction', callback);
    return () => socket.off('new-transaction', callback);
};

export default socket;
