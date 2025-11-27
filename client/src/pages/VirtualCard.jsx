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
            setCard(res.data);
            localStorage.setItem('currentCardId', res.data.id);
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
            setCard(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleLock = async () => {
        if (!card) return;
        try {
            const res = await cardApi.lock(card.id);
            setCard(res.data);
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
                <div className="empty-state glass-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <div style={{ marginBottom: '24px', color: 'var(--accent-color)' }}>
                        <CreditCard size={64} />
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
                <div className="card-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="card-section">
                        <div className="glass-card" style={{ padding: '32px', display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <CardView card={card} />
                        </div>

                        <div className="card-controls glass-card">
                            <div className="control-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span className="label" style={{ margin: 0 }}>Status</span>
                                <span className={`status-badge ${card.locked ? 'locked' : 'active'}`} style={{
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    background: card.locked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                    color: card.locked ? '#ef4444' : '#22c55e',
                                    fontWeight: '600',
                                    fontSize: '0.875rem'
                                }}>
                                    {card.locked ? 'Locked' : 'Active'}
                                </span>
                            </div>
                            <div className="control-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button className="btn-secondary" onClick={toggleLock}>
                                    {card.locked ? <Unlock size={16} /> : <Lock size={16} />}
                                    <span>{card.locked ? 'Unlock Card' : 'Lock Card'}</span>
                                </button>
                                <button className="btn-secondary" onClick={regenerateCard}>
                                    <RefreshCw size={16} />
                                    <span>Regenerate Details</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="transactions-section glass-card" style={{ height: 'fit-content' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Activity size={20} color="var(--accent-color)" />
                            <h3 style={{ margin: 0 }}>Recent Transactions</h3>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="empty-transactions" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                                <p>No transactions yet.</p>
                                <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Transactions will appear here automatically.</p>
                            </div>
                        ) : (
                            <div className="transactions-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="transaction-item slide-in-right" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '12px'
                                    }}>
                                        <div className="tx-icon" style={{
                                            background: 'rgba(56, 189, 248, 0.2)',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            color: '#38bdf8'
                                        }}>
                                            <ShoppingBag size={16} />
                                        </div>
                                        <div className="tx-details" style={{ flex: 1 }}>
                                            <div className="tx-merchant" style={{ fontWeight: '600' }}>{tx.merchant}</div>
                                            <div className="tx-date" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {new Date(tx.date).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div className="tx-amount" style={{ fontWeight: '600' }}>-${tx.amount}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualCard;
