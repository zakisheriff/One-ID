import React from 'react';

const CardView = ({ card }) => {
    return (
        <div className="virtual-card">
            {/* Top section: chip + contactless */}
            <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="chip"></div>
                <div className="contactless-icon">
                    <svg width="45" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                        <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                        <line x1="12" y1="20" x2="12.01" y2="20"></line>
                    </svg>
                </div>
            </div>

            {/* Card Number */}
            <div className="card-number">{card.number}</div>

            {/* Bottom section: details + brand */}
            <div className="card-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div className="detail-group">
                    <span className="detail-label">Card Holder</span>
                    <span className="detail-value">{card.holder.toUpperCase()}</span>
                </div>
                <div className="detail-group">
                    <span className="detail-label">Expires</span>
                    <span className="detail-value">{card.expiry}</span>
                </div>
                <div className="card-brand">VISA</div>
            </div>
        </div>
    );
};

export default CardView;
