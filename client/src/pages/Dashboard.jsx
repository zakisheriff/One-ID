import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, CreditCard, Activity, ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import '../styles/animations.css';

const Dashboard = () => {
    return (
        <div className="dashboard fade-in">
            {/* Hero Section */}
            <div className="hero-section" style={{
                textAlign: 'center',
                padding: '40px 0 60px', /* Reduced padding for mobile */
                maxWidth: '900px',
                margin: '0 auto',
                position: 'relative'
            }}>
                {/* Ambient Glow */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%', /* Responsive width */
                    maxWidth: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(79,172,254,0.15) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: -1,
                    pointerEvents: 'none'
                }}></div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', /* Responsive font size */
                    fontWeight: '800',
                    marginBottom: '24px',
                    lineHeight: '1.1',
                    letterSpacing: '-0.03em'
                }}>
                    Privacy tools for the <br />
                    <span style={{
                        background: 'var(--accent-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 20px rgba(79,172,254,0.4))'
                    }}>Liquid Web</span>
                </h1>
                <p style={{
                    fontSize: 'clamp(1rem, 4vw, 1.35rem)', /* Responsive font size */
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '48px',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Generate temporary identities instantly. Protect your privacy with disposable email, phone numbers, and virtual cards.
                </p>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                    <Link to="/email" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', flex: '1 1 auto', maxWidth: '200px', textAlign: 'center' }}>
                        Get Started
                    </Link>
                    <Link to="/settings" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem', flex: '1 1 auto', maxWidth: '200px', textAlign: 'center' }}>
                        Configure
                    </Link>
                </div>
            </div>

            {/* Feature Cards (Glass Tiles) */}
            <div className="grid-container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', /* Smaller min-width for mobile */
                gap: '24px',
                marginBottom: '80px'
            }}>
                {/* Email Card */}
                <Link
                    to="/email"
                    className="glass-panel feature-card delay-1 slide-in-up"
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: '32px', /* Reduced padding */
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'all 0.4s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        marginBottom: '24px',
                        color: '#4facfe',
                        background: 'rgba(79, 172, 254, 0.1)',
                        width: 'fit-content',
                        padding: '12px',
                        borderRadius: '16px',
                        boxShadow: '0 0 20px rgba(79, 172, 254, 0.2)'
                    }}>
                        <Mail size={32} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Temp Email</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', flex: 1, fontSize: '0.95rem' }}>
                        Instant disposable email addresses. Real-time inbox with HTML support and OTP detection.
                    </p>
                    <div style={{
                        color: '#4facfe',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: 'auto'
                    }}>
                        Open Inbox <ArrowRight size={18} />
                    </div>
                </Link>

                {/* Phone Card */}
                <Link
                    to="/phone"
                    className="glass-panel feature-card delay-2 slide-in-up"
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'all 0.4s ease'
                    }}
                >
                    <div style={{
                        marginBottom: '24px',
                        color: '#ffea00',
                        background: 'rgba(255, 234, 0, 0.1)',
                        width: 'fit-content',
                        padding: '12px',
                        borderRadius: '16px',
                        boxShadow: '0 0 20px rgba(255, 234, 0, 0.2)'
                    }}>
                        <Phone size={32} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Temp Phone</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', flex: 1, fontSize: '0.95rem' }}>
                        Virtual phone numbers for SMS verification. Receive codes instantly from any service.
                    </p>
                    <div style={{
                        color: '#ffea00',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: 'auto'
                    }}>
                        Open Phone <ArrowRight size={18} />
                    </div>
                </Link>

                {/* Card Card */}
                <Link
                    to="/card"
                    className="glass-panel feature-card delay-3 slide-in-up"
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'all 0.4s ease'
                    }}
                >
                    <div style={{
                        marginBottom: '24px',
                        color: '#ff1744',
                        background: 'rgba(255, 23, 68, 0.1)',
                        width: 'fit-content',
                        padding: '12px',
                        borderRadius: '16px',
                        boxShadow: '0 0 20px rgba(255, 23, 68, 0.2)'
                    }}>
                        <CreditCard size={32} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Virtual Card</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', flex: 1, fontSize: '0.95rem' }}>
                        Generate test credit cards for safe transactions. Simulate payments and authorizations.
                    </p>
                    <div style={{
                        color: '#ff1744',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: 'auto'
                    }}>
                        Open Wallet <ArrowRight size={18} />
                    </div>
                </Link>
            </div>

            {/* Recent Activity Section */}
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: 0 }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Activity</h3>
                <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                    <Activity
                        size={40}
                        color="var(--text-tertiary)"
                        style={{ marginBottom: '20px', display: 'block', margin: '0 auto 20px auto', opacity: 0.5 }}
                    />
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        No recent activity to show.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;