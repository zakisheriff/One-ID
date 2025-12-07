# One ID Server

Node.js Express server providing the API and simulation logic for One ID.

## API Endpoints

### Email
- `POST /api/email/new`: Create new inbox
- `GET /api/email/:address`: Get messages
- `DELETE /api/email/:address`: Delete inbox

### Phone
- `POST /api/phone/new`: Create new number
- `GET /api/phone/:number`: Get SMS
- `POST /api/phone/:number/send`: Send SMS (Simulation)

### Card
- `POST /api/card/new`: Create new card
- `POST /api/card/:id/lock`: Toggle lock
- `GET /api/card/:id/transactions`: Get transactions

### Settings
- `POST /api/settings/clear`: Clear all data
- `POST /api/settings/ttl`: Set Time-To-Live

## Simulation

The server runs background intervals to generate fake traffic for active users:
- Emails: Every 10-60s
- SMS: Every 20-40s
- Transactions: Every 30-90s

## Running Tests

```bash
npm test
```
