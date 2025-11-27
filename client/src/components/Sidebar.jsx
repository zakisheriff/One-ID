import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mail, Smartphone, CreditCard, Settings } from 'lucide-react';
import '../styles/layout.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo-container">
                <div className="logo-text">
                    Imposter <span className="badge"></span>
                </div>
            </div>
            <nav>
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/email"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <Mail size={20} />
                    <span>Temp Email</span>
                </NavLink>

                <NavLink
                    to="/phone"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <Smartphone size={20} />
                    <span>Temp Phone</span>
                </NavLink>

                <NavLink
                    to="/card"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <CreditCard size={20} />
                    <span>Virtual Card</span>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;