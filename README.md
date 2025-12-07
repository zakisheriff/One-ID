# <div align="center">One ID</div>

<div align="center">
<strong>The Safe Identity Lab for Privacy-Conscious Testing</strong>
</div>

<br />

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

<br />

<a href="https://imposter-hazel.vercel.app">
<img src="https://img.shields.io/badge/Live_Demo-4FC3F7?style=for-the-badge&logo=vercel&logoColor=white" height="40" />
</a>

</div>

<br />

> **"Your privacy playground for testing without compromise."**
>
> One ID isn't just another temporary email service. It's a complete identity simulation lab that lets you test services, sign up for trials, and protect your real identity — all with a stunning, modern interface that feels premium.

---

## 🌟 Vision

One ID's purpose is to be:

- **A complete privacy toolkit** for temporary identities
- **A beautifully designed web application** with glassmorphism aesthetics
- **A safe, educational platform** for understanding digital privacy

---

## ✨ Why One ID?

Stop using sketchy temporary email sites filled with ads.  
One ID is built from the ground up to be **fast, private, and beautifully designed**.

---

## 🎨 Stunning Glassmorphism UI

- **Premium Design Language**  
  Built with modern CSS featuring translucent glass panels and smooth animations.

- **Liquid Glass Effects**  
  Cards and panels with blurred backgrounds and glossy highlights.

- **Responsive & Mobile-First**  
  Works flawlessly on desktop, tablet, and mobile devices.

- **Dark Mode Ready**  
  Elegant color schemes that adapt to your preference.

---

## 🛡️ Privacy-First Features

### 📧 Temporary Email
- **Real Email Addresses**  
  Powered by Mail.tm API for actual email reception.

- **Instant Inbox**  
  Receive emails in real-time with Socket.io updates.

- **One-Click Copy**  
  Copy your temporary address instantly.

- **Auto-Cleanup**  
  Emails expire automatically for maximum privacy.

### 📱 Temporary Phone (Simulated)
- **Realistic Phone Numbers**  
  Valid-format US phone numbers for testing.

- **SMS Simulation**  
  Receive simulated verification codes and messages.

- **Real-Time Updates**  
  Messages appear instantly in your inbox.

### 💳 Virtual Card (Simulated)
- **Test Card Generation**  
  Valid-format card numbers for development testing.

- **Transaction Simulation**  
  Watch realistic transactions appear in real-time.

- **Card Controls**  
  Lock/unlock cards and regenerate CVV codes.

- **Transaction History**  
  Track all simulated purchases and charges.

---

## 🚀 Blazing Fast Performance

- **Real-Time Updates**  
  Socket.io powers instant message and transaction notifications.

- **In-Memory Storage**  
  Lightning-fast data access with automatic TTL cleanup.

- **Optimized Frontend**  
  Built with Vite for instant hot module replacement.

- **Edge Deployment**  
  Hosted on Vercel and Railway for global low-latency access.

---

## 🔌 Seamless Experience

- **No Sign-Up Required**  
  Start using immediately — no accounts, no tracking.

- **Panic Button**  
  Instantly clear all data with one click.

- **Customizable TTL**  
  Set how long your identities stay active.

- **Export & Share**  
  Copy addresses and card details with one click.

---

## 📁 Project Structure

```
One ID/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main app pages
│   │   ├── modules/        # API client & utilities
│   │   └── styles/         # CSS modules & themes
│   └── package.json
│
├── server/                 # Node.js + Express backend
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   │   ├── inboxService.js # Email handling
│   │   ├── smsService.js   # SMS simulation
│   │   ├── cardService.js  # Card generation
│   │   └── socketService.js # Real-time updates
│   └── server.js           # Main server file
│
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # You are here
```

---

## 🌐 Live Demo

**Try it now:** [https://imposter-hazel.vercel.app](https://imposter-hazel.vercel.app)

**Features to try:**
1. Generate a temporary email and send a test message
2. Create a virtual phone number and watch SMS arrive
3. Generate a virtual card and see simulated transactions
4. Test the panic button to clear everything instantly

---

## 🛠️ For Developers

### 1. Clone the repository

```bash
git clone https://github.com/zakisheriff/One ID.git
cd One ID
```

### 2. Install Dependencies

Install all dependencies for both client and server:

```bash
npm run install:all
```

### 3. Run Development Server

Start both frontend and backend concurrently:

```bash
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

---

## 📦 Deployment

Want to deploy your own instance?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions to deploy:
- **Frontend** → Vercel
- **Backend** → Railway

Both platforms offer generous free tiers!

---

## 🔧 Tech Stack

**Frontend:**
- React 18 with Vite
- CSS Modules with Glassmorphism
- Axios for API calls
- Socket.io Client for real-time updates
- React Router for navigation

**Backend:**
- Node.js + Express
- Socket.io for WebSocket connections
- Mail.tm API integration
- In-memory data storage with TTL
- CORS-enabled REST API

---

## 🎯 Use Cases

- **Developers:** Test sign-up flows without using real emails
- **Privacy Advocates:** Sign up for services without exposing your real identity
- **QA Testers:** Generate test data for payment and messaging flows
- **Students:** Learn about web APIs, real-time communication, and privacy

---

## 📝 API Documentation

### Email Endpoints
- `POST /api/email/new` - Create temporary email
- `GET /api/email/:address` - Get messages
- `DELETE /api/email/:address` - Delete email

### Phone Endpoints
- `POST /api/phone/new` - Generate phone number
- `GET /api/phone/:number` - Get SMS messages
- `POST /api/phone/:number/send` - Send SMS (simulation)

### Card Endpoints
- `POST /api/card/new` - Generate virtual card
- `POST /api/card/:id/lock` - Toggle card lock
- `GET /api/card/:id/transactions` - Get transaction history

---

## ⚠️ Disclaimer

One ID is an **educational and testing tool**. 

- **Email:** Uses Mail.tm API for real temporary emails
- **SMS & Cards:** Simulated for testing purposes only
- **Data:** All data is stored in-memory and cleared on restart
- **Privacy:** No user data is logged or tracked

**Do not use for:**
- Illegal activities
- Bypassing security measures
- Fraud or deception

---

## ☕️ Support the Project

If One ID helped you protect your privacy or saved you time:

- Consider buying me a coffee ☕
- Star the repository ⭐
- Share it with fellow developers 🚀

<div align="center">
<a href="https://buymeacoffee.com/zakisheriffw">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="60" width="217">
</a>
</div>

---

## 📄 License

MIT License - feel free to use this project for learning and development!

---

<p align="center">
Made with React & Node.js by <strong>Zaki Sheriff</strong>
</p>
