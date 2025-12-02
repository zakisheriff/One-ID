import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { connectSocket, disconnectSocket } from './modules/socket';
import './styles/layout.css';
import './styles/animations.css';
import './index.css';

function App() {
    useEffect(() => {
        connectSocket();
        return () => {
            disconnectSocket();
        };
    }, []);

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <div className="page-content">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    );
}

export default App;
