import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mail, Smartphone, CreditCard, Settings, ChevronDown, User } from 'lucide-react';
import '../styles/layout.css';

const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Left Section - Logo */}
                <div className="navbar-left">
                    <NavLink to="/" className="navbar-logo">
                        <span className="navbar-logo-text">One ID</span>
                    </NavLink>
                </div>



                {/* Right Section - Nav Links & Profile */}
                <div className="navbar-right">
                    <div className="navbar-nav">
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                        >
                            <div className="navbar-link-icon">
                                <LayoutDashboard size={20} />
                            </div>
                            <span className="navbar-link-text">Dashboard</span>
                        </NavLink>

                        <NavLink
                            to="/email"
                            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                        >
                            <div className="navbar-link-icon">
                                <Mail size={20} />
                            </div>
                            <span className="navbar-link-text">Email</span>
                        </NavLink>

                        <NavLink
                            to="/phone"
                            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                        >
                            <div className="navbar-link-icon">
                                <Smartphone size={20} />
                            </div>
                            <span className="navbar-link-text">Phone</span>
                        </NavLink>

                        <NavLink
                            to="/card"
                            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                        >
                            <div className="navbar-link-icon">
                                <CreditCard size={20} />
                            </div>
                            <span className="navbar-link-text">Cards</span>
                        </NavLink>
                    </div>

                    <div className="navbar-divider-vertical"></div>

                    <div
                        className={`navbar-profile ${isProfileOpen ? 'open' : ''}`}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="navbar-avatar">
                            <User size={16} />
                        </div>
                        <ChevronDown size={14} color="var(--text-muted)" />

                        <div className="navbar-profile-dropdown">
                            <div className="profile-header">
                                <div className="navbar-avatar large">
                                    <User size={24} />
                                </div>
                                <div className="profile-details">
                                    <h4>User</h4>
                                    <p>user@example.com</p>
                                </div>
                            </div>
                            <div className="dropdown-section">
                                <NavLink to="/settings" className="navbar-dropdown-item">
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
