import React, { useState, useEffect } from 'react';
import { cardApi } from '../modules/api';
import { joinRoom, onTransaction } from '../modules/socket';
import CardView from '../components/CardView';
import { CreditCard, Lock, Unlock, RefreshCw, ShoppingBag, Activity } from 'lucide-react';
import '../styles/card.css';

const VirtualCard = () => {
    const [card, setCard] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedCardId = localStorage.getItem('currentCardId');
        if (savedCardId) {
            createCard();
        }
    }, []);

    useEffect(() => {
        if (card) {
            joinRoom('card', card.id);
            const unsubscribe = onTransaction((tx) => {
                setTransactions(prev => [tx, ...prev]);
            });
            return () => unsubscribe();
        }
    }, [card]);

    const createCard = async () => {
        setLoading(true);
        try {
            const res = await cardApi.create();
            setCard(res);
            localStorage.setItem('currentCardId', res.id);
            setTransactions([]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const regenerateCard = async () => {
        if (!card) return;
        try {
            const res = await cardApi.regenerate(card.id);
            setCard(res);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleLock = async () => {
        if (!card) return;
        try {
            const res = await cardApi.toggleLock(card.id);
            setCard(res);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card-page fade-in">
            <div className="page-header">
                <h1 className="page-title">Virtual Card</h1>
                <div className="actions">
                    <button className="btn-primary" onClick={createCard} disabled={loading}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                        <span>{loading ? 'Generating...' : card ? 'New Card' : 'Generate Card'}</span>
                    </button>
                </div>
            </div>

            {!card ? (
                <div className="empty-state card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
                    <div style={{ marginBottom: '24px', color: 'var(--accent-color)' }}>
                        <CreditCard size={64} strokeWidth={1.5} />
                    </div>
                    <h2 style={{ marginBottom: '12px' }}>No Active Card</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Generate a virtual card to simulate transactions.
                    </p>
                    <button className="btn-primary" onClick={createCard}>
                        <RefreshCw size={16} />
                        <span>Generate Card</span>
                    </button>
                </div>
            ) : (
                <div className="card-container">
                    <div className="card-section">
                        <CardView card={card} />

                        <div className="transactions-list">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <Activity size={20} color="var(--accent-color)" />
                                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Recent Transactions</h3>
                            </div>

                            {transactions.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '48px 32px',
                                    color: 'var(--text-tertiary)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <div style={{ color: 'var(--accent-color)', opacity: 0.5 }}>
                                        <Activity size={48} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--text-secondary)', margin: 0 }}>No transactions yet</p>
                                        <p style={{ fontSize: '0.875rem', opacity: 0.7, margin: 0 }}>Transactions will appear here automatically</p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="transaction-item slide-in-up">
                                            <div className="merchant-info">
                                                <div className="merchant-icon">
                                                    <ShoppingBag size={18} />
                                                </div>
                                                <div>
                                                    <span className="merchant-name">{tx.merchant}</span>
                                                    <span className="transaction-date">{new Date(tx.date).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                            <span className="transaction-amount">-${tx.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card-controls">
                        <div className="control-header">
                            <h3>Card Settings</h3>
                        </div>
                        <div className="control-grid">
                            <div className="control-item">
                                <div className="control-label">
                                    <span className={`status-badge ${card.locked ? 'locked' : 'active'}`} style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        background: card.locked ? 'var(--error-bg)' : 'var(--success-bg)',
                                        color: card.locked ? 'var(--error-color)' : 'var(--success-color)',
                                        fontWeight: '600',
                                        fontSize: '0.875rem'
                                    }}>
                                        {card.locked ? 'Locked' : 'Active'}
                                    </span>
                                </div>
                                <br />
                                <button className="btn-secondary" onClick={toggleLock} style={{ width: '100%' }}>
                                    {card.locked ? <Unlock size={16} /> : <Lock size={16} />}
                                    <span>{card.locked ? 'Unlock' : 'Lock'}</span>
                                </button>
                            </div>
                            <br />
                            <div className="control-item">
                                <button className="btn-secondary" onClick={regenerateCard} style={{ width: '100%' }}>
                                    <RefreshCw size={16} />
                                    <span>Regenerate</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualCard;
