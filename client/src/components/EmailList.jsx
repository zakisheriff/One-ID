import React from 'react';

const EmailList = ({ messages, selectedId, onSelect }) => {
    if (messages.length === 0) {
        return (
            <div className="email-list" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No messages yet.
            </div>
        );
    }

    return (
        <div className="email-list">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`email-item ${selectedId === msg.id ? 'active' : ''} slide-in-right`}
                    onClick={() => onSelect(msg)}
                >
                    <div className="email-sender">
                        {msg.from.split('<')[0]}
                        <span className="email-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="email-subject">{msg.subject}</div>
                </div>
            ))}
        </div>
    );
};

export default EmailList;
