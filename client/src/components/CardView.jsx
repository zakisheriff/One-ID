import React, { useState } from 'react';

const CardView = ({ card }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="card-wrapper" onClick={() => setFlipped(!flipped)}>
            <div className={`credit-card ${flipped ? 'flipped' : ''}`}>
                <div className="card-front">
                    <div className="card-chip"></div>
                    <div className="card-logo">VISA</div>
                    <div className="card-number">{card.number}</div>
                    <div className="card-meta">
                        <div className="card-holder">
                            <span>Card Holder</span>
                            <div>{card.holder.toUpperCase()}</div>
                        </div>
                        <div className="card-expiry">
                            <span>Expires</span>
                            <div>{card.expiry}</div>
                        </div>
                    </div>
                </div>
                <div className="card-back">
                    <div className="magnetic-strip"></div>
                    <div className="cvv-box">
                        <span className="cvv-label">CVV</span>
                        <div className="cvv-value">{card.cvv}</div>
                    </div>
                    <div className="card-disclaimer">
                        This is a simulated card for educational purposes only. Not valid for real payments.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardView;
