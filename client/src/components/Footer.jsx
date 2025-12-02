import React from 'react';
import '../styles/layout.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <span className="footer-logo">Imposter</span>
                    <span className="footer-copyright">© {new Date().getFullYear()} All rights reserved.</span>
                </div>
                <div className="footer-links">
                    <a href="#" className="footer-link">Privacy</a>
                    <a href="#" className="footer-link">Terms</a>
                    <a href="#" className="footer-link">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
