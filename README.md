# Imposter - Safe Identity Lab Simulation

Imposter is a self-hosted, safe, educational web application that simulates identity tools:
- **Temporary Email**: Generate disposable email addresses and receive real emails via Mail.tm.
- **Temporary Phone**: Generate fake phone numbers and receive simulated SMS.
- **Virtual Cards**: Generate valid-format test credit cards and simulate transactions.

> **NOTE**: This is a **simulation/educational tool**. Email uses Mail.tm API for real temporary emails. SMS and card transactions are simulated. All data is stored in-memory and lost upon server restart.

## 🚀 Live Demo

**Frontend:** [https://your-app.vercel.app](https://your-app.vercel.app)  
**Backend:** [https://your-app.up.railway.app](https://your-app.up.railway.app)

> Replace with your actual deployment URLs after deploying

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to Vercel (frontend) and Railway (backend).

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
