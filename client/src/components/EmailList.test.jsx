import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailList from './EmailList';

describe('EmailList Component', () => {
    const mockMessages = [
        { id: '1', from: 'test@example.com', subject: 'Hello', timestamp: new Date().toISOString() },
        { id: '2', from: 'other@example.com', subject: 'World', timestamp: new Date().toISOString() }
    ];

    it('renders "No messages" when empty', () => {
        render(<EmailList messages={[]} />);
        expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();
    });

    it('renders messages when provided', () => {
        render(<EmailList messages={mockMessages} />);
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('World')).toBeInTheDocument();
    });

    it('calls onSelect when a message is clicked', () => {
        const handleSelect = jest.fn();
        render(<EmailList messages={mockMessages} onSelect={handleSelect} />);

        fireEvent.click(screen.getByText('Hello'));
        expect(handleSelect).toHaveBeenCalledWith(mockMessages[0]);
    });
});
