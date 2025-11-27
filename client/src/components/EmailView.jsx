import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Copy, Check, ExternalLink } from 'lucide-react';

const EmailView = ({ message }) => {
    const [copiedCode, setCopiedCode] = useState(null);

    // Configure DOMPurify to open links in new tab
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
        }
    });

    const sanitizedBody = useMemo(() => {
        if (!message) return '';
        // If body is just text, wrap in pre-wrap div, else sanitize HTML
        const isHtml = /<[a-z][\s\S]*>/i.test(message.body);
        if (isHtml) {
            return DOMPurify.sanitize(message.body);
        } else {
            // Convert newlines to <br> for plain text
            return message.body.replace(/\n/g, '<br>');
        }
    }, [message]);

    const detectedCode = useMemo(() => {
        if (!message) return null;
        // Try to find a code in the text content (prefer message.text if available, else strip tags)
        const text = message.text || message.body.replace(/<[^>]*>/g, ' ');

        // Regex for common OTP patterns:
        // 1. "code is 123456"
        // 2. "verification code: 1234"
        // 3. Just a standalone 4-8 digit number surrounded by whitespace
        const patterns = [
            /(?:code|pin|otp|verification|password).*?(\d{4,8})/i,
            /\b(\d{4,8})\b/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    }, [message]);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 3000);
    };

    if (!message) {
        return (
            <div className="empty-view">
                <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>📨</div>
                <p>Select a message to read</p>
            </div>
        );
    }

    return (
        <div className="message-view fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: "20px" }}>
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

            <div className="message-body-container" style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                <div
                    className="message-body html-content"
                    dangerouslySetInnerHTML={{ __html: sanitizedBody }}
                />
            </div>
        </div>
    );
};

export default EmailView;
