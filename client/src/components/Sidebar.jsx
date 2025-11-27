import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mail, Smartphone, CreditCard, Settings } from 'lucide-react';
import '../styles/layout.css';

const Sidebar = () => {
    // Shared style to remove underline and inherit text color
    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit' 
    };

    return (
        <aside className="sidebar glass-panel">
            <div className="logo-container">
                <h2>Imposter</h2>
            </div>
            <nav>
                <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    style={linkStyle}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                
                <NavLink 
                    to="/email" 
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    style={linkStyle}
                >
                    <Mail size={20} />
                    <span>Temp Email</span>
                </NavLink>
                
                <NavLink 
                    to="/phone" 
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    style={linkStyle}
                >
                    <Smartphone size={20} />
                    <span>Temp Phone</span>
                </NavLink>
                
                <NavLink 
                    to="/card" 
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    style={linkStyle}
                >
                    <CreditCard size={20} />
                    <span>Virtual Card</span>
                </NavLink>
                
                <NavLink 
                    to="/settings" 
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    style={linkStyle}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;