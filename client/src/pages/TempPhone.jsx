import React, { useState, useEffect, useRef } from 'react';
import { phoneApi } from '../modules/api';
import { joinRoom, onSms } from '../modules/socket';
import { Smartphone, Trash2, RefreshCw, Copy, Send, Check, MessageSquare, Phone } from 'lucide-react';
import '../styles/phone.css';

const TempPhone = () => {
    const [number, setNumber] = useState(localStorage.getItem('currentPhone') || null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [testMessage, setTestMessage] = useState('');
    const [copied, setCopied] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (number) {
            loadMessages(number);
            joinRoom('phone', number);

            const unsubscribe = onSms((message) => {
                setMessages(prev => [...prev, message]);
            });

            return () => unsubscribe();
        }
    }, [number]);

    const loadMessages = async (num) => {
        try {
            const res = await phoneApi.getMessages(num);
            setMessages(res.messages);
        } catch (err) {
            console.error(err);
        }
    };

    const createNumber = async () => {
        setLoading(true);
        try {
            const res = await phoneApi.create();
            setNumber(res.number);
            localStorage.setItem('currentPhone', res.number);
            setMessages([]);
            setCopied(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteNumber = async () => {
        if (!number) return;
        if (window.confirm('Delete this number?')) {
            try {
                await phoneApi.delete(number);
                setNumber(null);
                localStorage.removeItem('currentPhone');
                setMessages([]);
                setCopied(false);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const sendTestMessage = async (e) => {
        e.preventDefault();
        if (!testMessage.trim()) return;
        try {
            await phoneApi.send(number, { body: testMessage, from: 'Me' });
            setTestMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(number);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    // Mobile View State
    const [isMobileView, setIsMobileView] = useState(false);
    const [showMobileDetail, setShowMobileDetail] = useState(false);

    // Detect Mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };
        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSelectNumber = (num) => {
        // Logic to select number (if multiple supported in future)
        // For now, we only have one number, so this is just for the chat view
        if (isMobileView) {
            setShowMobileDetail(true);
        }
    };

    // Auto-show detail if messages exist on mobile (optional, but good for UX)
    useEffect(() => {
        if (isMobileView && messages.length > 0 && !showMobileDetail) {
            // setShowMobileDetail(true); // Uncomment if we want auto-open
        }
    }, [messages, isMobileView]);

    const handleBackToList = () => {
        setShowMobileDetail(false);
    };

    return (
        <div className="temp-phone fade-in">
            <div className="page-header">
                <h1 className="page-title">Temp Phone</h1>
                <div className="actions">
                    {number && (
                        <button className="btn-secondary" onClick={deleteNumber} style={{ marginRight: '8px' }}>
                            <Trash2 size={16} />
                            <span>Delete Number</span>
                        </button>
                    )}
                    <button className="btn-primary" onClick={createNumber} disabled={loading}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                        <span>{loading ? 'Generating...' : number ? 'Regenerate' : 'Generate Number'}</span>
                    </button>
                </div>
            </div>

            {!number ? (
                <div className="empty-state card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
                    <div style={{ marginBottom: '24px', color: 'var(--warning-color)' }}>
                        <Phone size={64} strokeWidth={1.5} />
                    </div>
                    <h2 style={{ marginBottom: '12px' }}>No Active Number</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Generate a temporary phone number to receive SMS.
                    </p>
                    <button className="btn-primary" onClick={createNumber}>
                        <RefreshCw size={16} />
                        <span>Generate Number</span>
                    </button>
                </div>
            ) : (
                <div className={`phone-layout ${isMobileView ? 'mobile' : ''}`}>
                    {/* Sidebar / Info View */}
                    <div className={`phone-sidebar ${isMobileView && showMobileDetail ? 'hidden' : ''}`}>
                        <div className="current-number">
                            <span className="label">Your Number</span>
                            <div className="number-display" onClick={handleCopy} style={{ cursor: 'pointer' }}>
                                <code>{number}</code>
                                <button
                                    className="btn-icon"
                                    onClick={handleCopy}
                                    title="Copy"
                                    style={{
                                        color: copied ? 'var(--success-color)' : 'inherit',
                                    }}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="message-list">
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <p style={{ marginBottom: '16px' }}>Use this number to receive SMS verification codes.</p>
                                {isMobileView && (
                                    <button className="btn-primary" onClick={() => setShowMobileDetail(true)} style={{ width: '100%' }}>
                                        View Messages ({messages.length})
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content / Chat View */}
                    <div className={`phone-content ${isMobileView && !showMobileDetail ? 'hidden' : ''}`}>
                        {isMobileView && (
                            <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                <button className="btn-secondary" onClick={handleBackToList} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                    ← Back to Number
                                </button>
                            </div>
                        )}
                        <div className="chat-header">
                            <div className="chat-avatar">
                                <MessageSquare size={20} />
                            </div>
                            <div className="chat-info">
                                <h3>Messages</h3>
                                <span>{messages.length} received</span>
                            </div>
                        </div>
                        <div className="chat-body">
                            {messages.length === 0 ? (
                                <div className="empty-state">
                                    <p>No messages yet.</p>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Waiting for SMS...</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className="chat-bubble received slide-in-up">
                                        <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
                                            {msg.from}
                                        </div>
                                        {msg.body}
                                        <span className="bubble-time">{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="chat-footer" style={{ padding: '16px', borderTop: '1px solid var(--glass-border)' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                                Messages refresh automatically every 5 seconds.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TempPhone;
