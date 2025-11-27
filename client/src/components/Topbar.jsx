import React, { useState, useEffect } from 'react';
import { settingsApi } from '../modules/api';
import { Moon, Sun, AlertTriangle, User } from 'lucide-react';
import '../styles/layout.css';

const Topbar = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handlePanic = async () => {
        if (window.confirm('PANIC: Clear all simulation data?')) {
            try {
                await settingsApi.clear();
                window.location.reload();
            } catch (error) {
                console.error('Failed to clear data', error);
            }
        }
    };

    return (
        <header className="topbar glass-panel">
            <div className="breadcrumbs">
                {/* Breadcrumbs could go here */}
            </div>
            <div className="actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button className="btn-primary" onClick={handlePanic} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}>
                    <AlertTriangle size={18} />
                    <span>Panic</span>
                </button>
                <div className="profile-icon" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <User size={20} color="var(--text-secondary)" />
                </div>
            </div>
        </header>
    );
};

export default Topbar;
