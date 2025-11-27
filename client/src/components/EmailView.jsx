import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react';

const EmailView = ({ message, onBack, isMobileView }) => {
    const [copiedCode, setCopiedCode] = useState(null);

    // Configure DOMPurify to open links in new tab
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
        }
    });

    const sanitizedBody = useMemo(() => {
        if (!message?.body) return '';
        return DOMPurify.sanitize(message.body, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'img'],
            ALLOWED_ATTR: ['href', 'target', 'style', 'class', 'src', 'alt', 'width', 'height']
        });
    }, [message?.body]);

    const detectedCode = useMemo(() => {
        if (!message?.text) return null;
        const otpPattern = /\b\d{4,8}\b/;
        const match = message.text.match(otpPattern);
        return match ? match[0] : null;
    }, [message?.text]);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 3000);
    };

    if (!message) {
        return (
            <div className="empty-view" style={{ textAlign: 'center', alignContent: "center", alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>📨</div>
                <p>Select a message to read</p>
            </div>
        );
    }

    return (
        <div className="message-view fade-in" style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: "20px",
            background: isMobileView ? 'rgba(20, 22, 40, 0.6)' : 'transparent',
            backdropFilter: isMobileView ? 'blur(20px)' : 'none',
            borderRadius: isMobileView ? 'var(--radius-lg)' : '0',
            border: isMobileView ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
        }}>
            {isMobileView && onBack && (
                <button
                    className="btn-secondary"
                    onClick={onBack}
                    style={{
                        marginBottom: '16px',
                        width: 'fit-content'
                    }}
                >
                    <ArrowLeft size={18} />
                    <span>Back to Inbox</span>
                </button>
            )}
            <div className="message-header">
                <h2 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>{message.subject}</h2>
                <div className="message-meta">
                    <span className="meta-label">From:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{message.from}</span>
                    <span className="meta-label">Date:</span>
                    <span>{new Date(message.timestamp).toLocaleString()}</span>
                </div>

                {detectedCode && (
                    <div className="otp-banner slide-in-up" style={{
                        marginTop: '20px',
                        background: 'rgba(52, 199, 89, 0.15)',
                        border: '1px solid rgba(52, 199, 89, 0.3)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                background: '#34c759',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }}>
                                OTP Detected
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '2px', color: '#34c759' }}>
                                {detectedCode}
                            </span>
                        </div>
                        <button
                            className="btn-icon"
                            onClick={() => handleCopyCode(detectedCode)}
                            style={{
                                background: 'rgba(52, 199, 89, 0.2)',
                                color: '#34c759',
                                width: '36px',
                                height: '36px'
                            }}
                            title="Copy Code"
                        >
                            {copiedCode === detectedCode ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                )}
            </div>
            <br />

            <div className="message-body-container" style={{ flex: 1, overflowY: 'auto', position: 'relative', borderRadius: '12px' }}>
                <div
                    className="message-body html-content"
                    dangerouslySetInnerHTML={{ __html: sanitizedBody }}
                />
            </div>
        </div>
    );
};

export default EmailView;
