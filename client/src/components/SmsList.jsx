import React, { useEffect, useRef } from 'react';

const SmsList = ({ messages }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="empty-sms">
                <p>No messages yet. Waiting for incoming SMS...</p>
            </div>
        );
    }

    return (
        <div className="sms-list">
            {messages.map((msg) => (
                <div key={msg.id} className={`sms-bubble ${msg.from === 'Me' ? 'sent' : 'received'} slide-in-up`}>
                    <div className="sms-meta">
                        <span className="sms-sender">{msg.from}</span>
                        <span className="sms-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="sms-body">{msg.body}</div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
};

export default SmsList;
