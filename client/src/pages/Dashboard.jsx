import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, CreditCard, Activity, ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import '../styles/animations.css';

const Dashboard = () => {
    return (
        <div className="dashboard fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '8px' }}>
                        Manage your temporary services
                    </p>
                </div>
            </div>

            

            {/* Main Service Cards */}
            <div className="grid-container" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '24px',
                marginBottom: '32px'
            }}>
                <Link 
                    to="/email" 
                    className="glass-card delay-1 slide-in-up" 
                    style={{ 
                        textDecoration: 'none', 
                        color: 'inherit',
                        padding: '32px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ 
                        width: '64px', 
                        height: '64px',
                        background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.2) 0%, rgba(10, 132, 255, 0.1) 100%)',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        border: '1px solid rgba(0, 122, 255, 0.3)'
                    }}>
                        <Mail size={32} color="#007AFF" strokeWidth={2} />
                    </div>
                    <h3 style={{ 
                        fontSize: '1.375rem', 
                        fontWeight: '700', 
                        marginBottom: '8px',
                        letterSpacing: '-0.02em'
                    }}>
                        Temp Email
                    </h3>
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        lineHeight: '1.6',
                        fontSize: '0.9375rem',
                        marginBottom: '16px'
                    }}>
                        Generate disposable email addresses. Receive messages in real-time with full inbox management.
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#007AFF',
                        fontWeight: '600',
                        fontSize: '0.9375rem'
                    }}>
                        <span>Open Service</span>
                        <ArrowRight size={18} />
                    </div>
                </Link>

                <Link 
                    to="/phone" 
                    className="glass-card delay-2 slide-in-up" 
                    style={{ 
                        textDecoration: 'none', 
                        color: 'inherit',
                        padding: '32px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ 
                        width: '64px', 
                        height: '64px',
                        background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.2) 0%, rgba(48, 209, 88, 0.1) 100%)',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        border: '1px solid rgba(52, 199, 89, 0.3)'
                    }}>
                        <Phone size={32} color="#34c759" strokeWidth={2} />
                    </div>
                    <h3 style={{ 
                        fontSize: '1.375rem', 
                        fontWeight: '700', 
                        marginBottom: '8px',
                        letterSpacing: '-0.02em'
                    }}>
                        Temp Phone
                    </h3>
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        lineHeight: '1.6',
                        fontSize: '0.9375rem',
                        marginBottom: '16px'
                    }}>
                        Simulate SMS verification. Receive text messages instantly with virtual phone numbers.
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#34c759',
                        fontWeight: '600',
                        fontSize: '0.9375rem'
                    }}>
                        <span>Open Service</span>
                        <ArrowRight size={18} />
                    </div>
                </Link>

                <Link 
                    to="/card" 
                    className="glass-card delay-3 slide-in-up" 
                    style={{ 
                        textDecoration: 'none', 
                        color: 'inherit',
                        padding: '32px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ 
                        width: '64px', 
                        height: '64px',
                        background: 'linear-gradient(135deg, rgba(94, 92, 230, 0.2) 0%, rgba(99, 97, 242, 0.1) 100%)',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        border: '1px solid rgba(94, 92, 230, 0.3)'
                    }}>
                        <CreditCard size={32} color="#5e5ce6" strokeWidth={2} />
                    </div>
                    <h3 style={{ 
                        fontSize: '1.375rem', 
                        fontWeight: '700', 
                        marginBottom: '8px',
                        letterSpacing: '-0.02em'
                    }}>
                        Virtual Card
                    </h3>
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        lineHeight: '1.6',
                        fontSize: '0.9375rem',
                        marginBottom: '16px'
                    }}>
                        Generate test credit card numbers. Simulate transactions with virtual payment methods.
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#5e5ce6',
                        fontWeight: '600',
                        fontSize: '0.9375rem'
                    }}>
                        <span>Open Service</span>
                        <ArrowRight size={18} />
                    </div>
                </Link>
            </div>

            {/* Recent Activity Section */}
            <div className="glass-card" style={{ padding: '32px' }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700',
                        letterSpacing: '-0.02em'
                    }}>
                        Recent Activity
                    </h3>
                    <Clock size={20} color="var(--text-secondary)" />
                </div>
                <div style={{ 
                    padding: '48px 20px', 
                    textAlign: 'center', 
                    color: 'var(--text-secondary)',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <Activity 
                        size={48} 
                        color="var(--text-secondary)" 
                        style={{ 
                            opacity: 0.3, 
                            marginBottom: '16px',
                            display: 'block',
                            margin: '0 auto 16px auto'
                        }} 
                    />
                    <p style={{ fontSize: '0.9375rem' }}>
                        No recent activity to show.
                    </p>
                    <p style={{ fontSize: '0.8125rem', marginTop: '8px', opacity: 0.7 }}>
                        Your activity will appear here once you start using services.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;