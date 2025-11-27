import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { connectSocket, disconnectSocket } from './modules/socket';
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
            <Sidebar />
            <main className="main-content">
                <Topbar />
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default App;
