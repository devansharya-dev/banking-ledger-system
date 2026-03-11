# Banking Ledger System

Backend API for a banking-style ledger and transaction system built with Node.js, Express, and MongoDB.

## Features

- User registration and login with JWT authentication
- Protected account creation
- Ledger-based transaction recording
- Initial funds route for system users
- Idempotency key support for transaction requests

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Nodemailer

## Project Structure

```text
src/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
server.js
```

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Accounts

- `POST /api/accounts`

### Transactions

- `POST /api/transactions`
- `POST /api/transactions/system/initial-funds`

## Environment Variables

Create a `.env` file in the project root with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The server starts on `http://localhost:3000`.

## Notes

- The current transaction flow is implemented without MongoDB replica-set transactions, so it works on a local standalone MongoDB instance.
- `.env` is intentionally excluded from version control.
