# Imposter - Safe Identity Lab Simulation

Imposter is a self-hosted, safe, educational web application that simulates identity tools:
- **Temporary Email**: Generate disposable email addresses and receive simulated emails.
- **Temporary Phone**: Generate fake phone numbers and receive simulated SMS.
- **Virtual Cards**: Generate valid-format test credit cards and simulate transactions.

> **NOTE**: This is a **simulation only**. No real emails, SMS, or payments are processed. All data is stored in-memory and lost upon server restart.

## Project Structure

- `/client`: React application (Vite)
- `/server`: Node.js Express server with Socket.io

## Prerequisites

- Node.js (v16+)
- npm

## Quick Start

1. Install dependencies for both client and server:
   ```bash
   npm run install:all
   ```

2. Start the development server (runs both client and server concurrently):
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173` (or the port shown in the terminal).

## Features

- **Real-time Updates**: Uses Socket.io to push new simulated messages and transactions to the UI instantly.
- **Background Simulation**: The server automatically generates traffic (emails, SMS, transactions) for active identities.
- **In-Memory Storage**: Fast and privacy-focused; data is wiped on restart.
- **Responsive UI**: Glassmorphism design that works on desktop and mobile.

## API Documentation

See `/server/README.md` for API details.

## License

MIT
