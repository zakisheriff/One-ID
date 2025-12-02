import React, { useState } from 'react';
import { settingsApi } from '../modules/api';
import { Trash2, Save, AlertTriangle, Clock, Shield, Info } from 'lucide-react';
import '../styles/animations.css';
import '../styles/settings.css';

const Settings = () => {
    const [ttl, setTtl] = useState({
        email: 10,
        phone: 10,
        card: 1440 // 24 hours in minutes
    });
    const [status, setStatus] = useState('');

    const handleClear = async () => {
        if (window.confirm('Are you sure you want to clear ALL simulation data?')) {
            try {
                await settingsApi.clear();
                setStatus('Data cleared successfully.');
                setTimeout(() => setStatus(''), 3000);
            } catch (err) {
                console.error(err);
                setStatus('Failed to clear data.');
            }
        }
    };

    const updateTtl = async (service, minutes) => {
        try {
            await settingsApi.setTTL(service, minutes * 60 * 1000);
            setTtl(prev => ({ ...prev, [service]: minutes }));
            setStatus(`Updated ${service} TTL to ${minutes} minutes.`);
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="settings-page fade-in">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
            </div>

            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Shield size={20} color="var(--accent-color)" />
                        <h3 style={{ margin: 0 }}>Real SMS Configuration (Twilio)</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                        Enter your Twilio credentials to enable real SMS reception. Leave blank to use simulation.
                    </p>

                    <div className="setting-row" style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Account SID</label>
                        <input
                            type="text"
                            placeholder="AC..."
                            className="glass-input"
                        />
                    </div>
                    <div className="setting-row" style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Auth Token</label>
                        <input
                            type="password"
                            placeholder="Token"
                            className="glass-input"
                        />
                    </div>
                    <div className="setting-row" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Twilio Phone Number</label>
                        <input
                            type="text"
                            placeholder="+1234567890"
                            className="glass-input"
                        />
                    </div>
                    <button className="btn-primary" style={{ width: '100%' }} onClick={() => setStatus('Twilio settings saved (Simulation active until keys verified)')}>
                        <Save size={16} />
                        <span>Save Twilio Settings</span>
                    </button>
                </div>

                <div style={{ marginBottom: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Clock size={20} color="var(--accent-color)" />
                        <h3 style={{ margin: 0 }}>Simulation Parameters</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                        Adjust how long data persists before auto-deletion.
                    </p>

                    <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <label>Email TTL (minutes)</label>
                        <input
                            type="number"
                            value={ttl.email}
                            onChange={(e) => updateTtl('email', parseInt(e.target.value))}
                            className="glass-input"
                            style={{ width: '80px' }}
                        />
                    </div>

                    <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <label>Phone TTL (minutes)</label>
                        <input
                            type="number"
                            value={ttl.phone}
                            onChange={(e) => updateTtl('phone', parseInt(e.target.value))}
                            className="glass-input"
                            style={{ width: '80px' }}
                        />
                    </div>

                    <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <label>Card TTL (minutes)</label>
                        <input
                            type="number"
                            value={ttl.card}
                            onChange={(e) => updateTtl('card', parseInt(e.target.value))}
                            className="glass-input"
                            style={{ width: '80px' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#ef4444' }}>
                        <AlertTriangle size={20} />
                        <h3 style={{ margin: 0, color: 'var(--accent-error)' }}>Danger Zone</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                        Irreversible actions.
                    </p>
                    <button className="btn-danger" onClick={handleClear} style={{ width: '100%' }}>
                        <Trash2 size={16} />
                        <span>Clear All Data</span>
                    </button>
                </div>

                {status && (
                    <div className="status-message scale-in" style={{
                        padding: '12px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        color: '#38bdf8',
                        marginTop: '24px'
                    }}>
                        {status}
                    </div>
                )}
            </div>

            <div className="about-section" style={{ maxWidth: '600px', margin: '32px auto', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Info size={16} />
                    <p style={{ margin: 0 }}><strong>Imposter Lab Simulation</strong></p>
                </div>
                <p>Version 1.1.0 (Real Email Enabled)</p>
                <div style={{ marginTop: '16px', lineHeight: '1.6' }}>
                    <strong>Email:</strong> Uses real temporary email addresses via Mail.tm.<br />
                    <strong>SMS:</strong> Simulated (requires Twilio for real messages).<br />
                    <strong>Cards:</strong> Simulated (Luhn-valid numbers).
                </div>
            </div>
        </div>
    );
};

export default Settings;
