import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import TempEmail from './pages/TempEmail';
import TempPhone from './pages/TempPhone';
import VirtualCard from './pages/VirtualCard';
import Settings from './pages/Settings';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'email',
                element: <TempEmail />,
            },
            {
                path: 'phone',
                element: <TempPhone />,
            },
            {
                path: 'card',
                element: <VirtualCard />,
            },
            {
                path: 'settings',
                element: <Settings />,
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            }
        ],
    },
]);

export default router;
