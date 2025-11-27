import React, { useState, useEffect } from 'react';
import { emailApi } from '../modules/api';
import { joinRoom, onEmail } from '../modules/socket';
import EmailList from '../components/EmailList';
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
            setMessages(res.data.messages);
        } catch (err) {
            console.error(err);
        }
    };

    const createEmail = async () => {
        setLoading(true);
        try {
            const res = await emailApi.create();
            setAddress(res.data.address);
            localStorage.setItem('currentEmail', res.data.address);
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

    return (
        <div className="email-page fade-in">
            <div className="page-header">
                <h1 className="page-title">Temp Email</h1>
                <div className="actions">
                    {address && (
                        <button className="btn-secondary" onClick={deleteInbox} style={{ marginRight: '8px' }}>
                            <Trash2 size={16} />
                            <span>Delete Inbox</span>
                        </button>
                    )}
                    <button className="btn-primary" onClick={createEmail} disabled={loading}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                        <span>{loading ? 'Generating...' : address ? 'Regenerate' : 'Generate Email'}</span>
                    </button>
                </div>
            </div>

            {!address ? (
                <div className="empty-state glass-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <div style={{ marginBottom: '24px', color: 'var(--accent-color)' }}>
                        <Mail size={64} />
                    </div>
                    <h2 style={{ marginBottom: '12px' }}>No Active Inbox</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Generate a temporary email address to get started.
                    </p>
                    <button className="btn-primary" onClick={createEmail}>
                        <RefreshCw size={16} />
                        <span>Generate Email</span>
                    </button>
                </div>
            ) : (
                <div className="email-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', height: 'calc(100vh - 140px)' }}>
                    <div className="email-sidebar glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                        <div className="current-email" style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span className="label">Your Address</span>
                            <div className="address-box" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(0,0,0,0.2)',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                marginTop: '8px'
                            }}>
                                <code style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{address}</code>
                                <button
                                    className="btn-icon"
                                    onClick={handleCopy}
                                    title="Copy to clipboard"
                                    style={{
                                        color: copied ? '#86868b' : 'inherit',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        <div style={{
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(0,0,0,0.1)'
                        }}>
                            <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inbox</span>
                            <button
                                className="btn-icon"
                                onClick={handleRefresh}
                                title="Refresh Inbox"
                                disabled={refreshing}
                                style={{ opacity: refreshing ? 0.5 : 1 }}
                            >
                                <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <EmailList
                                messages={messages}
                                selectedId={selectedMessage?.id}
                                onSelect={setSelectedMessage}
                            />
                        </div>
                    </div>
                    <div className="email-content glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <EmailView message={selectedMessage} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TempEmail;
