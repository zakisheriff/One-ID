import React, { useState, useEffect } from 'react';
import { emailApi } from '../modules/api';
import { joinRoom, onEmail } from '../modules/socket';
import EmailView from '../components/EmailView';
import { Mail, Trash2, RefreshCw, Copy, Inbox, Check } from 'lucide-react';
import '../styles/email.css';

const TempEmail = () => {
    const [address, setAddress] = useState(localStorage.getItem('currentEmail') || null);
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (address) {
            loadMessages(address);
            joinRoom('email', address);

            const unsubscribe = onEmail((message) => {
                setMessages(prev => [message, ...prev]);
            });

            return () => unsubscribe();
        }
    }, [address]);

    const loadMessages = async (addr) => {
        try {
            const res = await emailApi.getMessages(addr);
            setMessages(res.messages);
        } catch (err) {
            console.error(err);
        }
    };

    const createEmail = async () => {
        setLoading(true);
        try {
            const res = await emailApi.create();
            setAddress(res.address);
            localStorage.setItem('currentEmail', res.address);
            setMessages([]);
            setSelectedMessage(null);
            setCopied(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteInbox = async () => {
        if (!address) return;
        if (window.confirm('Are you sure you want to delete this inbox?')) {
            try {
                await emailApi.delete(address);
                setAddress(null);
                localStorage.removeItem('currentEmail');
                setMessages([]);
                setSelectedMessage(null);
                setCopied(false);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (!address) return;
        setRefreshing(true);
        // Ensure spinner shows for at least 500ms for better UX
        await Promise.all([
            loadMessages(address),
            new Promise(resolve => setTimeout(resolve, 500))
        ]);
        setRefreshing(false);
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

    const handleSelectMessage = (msg) => {
        setSelectedMessage(msg);
        if (isMobileView) {
            setShowMobileDetail(true);
        }
    };

    const handleBackToInbox = () => {
        setShowMobileDetail(false);
        setSelectedMessage(null);
    };

    return (
        <div className="temp-email fade-in">
            <div className="page-header">
                <h1 className="page-title">Temp Email</h1>
                <div className="actions">
                    <button className="btn-secondary" onClick={handleCopy} disabled={!address} style={{ color: copied ? 'var(--success-color)' : 'inherit' }}>
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button className="btn-primary" onClick={createEmail} disabled={loading}>
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                        <span>New Address</span>
                    </button>
                    <button className="btn-secondary" onClick={handleRefresh} disabled={refreshing || !address}>
                        <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            {!address ? (
                <div className="empty-guide">
                    <div className="empty-guide-icon">
                        <Mail size={40} strokeWidth={1.5} />
                    </div>
                    <h2>No Active Email</h2>
                    <p>
                        Generate a new temporary email address to receive messages.
                        This guide will disappear once you generate an email.
                    </p>
                    <button className="btn-primary" onClick={createEmail}>
                        <RefreshCw size={16} />
                        <span>Generate Email</span>
                    </button>
                </div>
            ) : (
                <div className={`email-layout ${isMobileView ? 'mobile' : ''}`}>
                    {/* Sidebar / List View */}
                    <div className={`email-sidebar ${isMobileView && showMobileDetail ? 'hidden' : ''}`}>
                        <div className="current-email">
                            <span className="label">Current Address</span>
                            <div className="address-box" onClick={handleCopy} style={{ cursor: 'pointer' }}>
                                <code>{address}</code>
                                <Copy size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                            </div>
                        </div>
                        <div className="email-list">
                            {messages.length === 0 ? (
                                <div style={{
                                    padding: '48px 32px',
                                    textAlign: 'center',
                                    color: 'var(--text-tertiary)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <div style={{
                                        color: 'var(--accent-color)',
                                        opacity: 0.5,
                                        marginBottom: '8px'
                                    }}>
                                        <Inbox size={48} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>No messages yet</p>
                                        <p style={{ fontSize: '0.875rem', margin: 0 }}>Send an email to this address to see it here</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`email-item ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                                        onClick={() => handleSelectMessage(msg)}
                                    >
                                        <div className="email-sender">
                                            <span>{msg.from}</span>
                                            <span className="email-time">{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="email-subject">{msg.subject}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="email-content">
                        <EmailView
                            message={selectedMessage}
                            onBack={handleBackToInbox}
                            isMobileView={isMobileView}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TempEmail;
