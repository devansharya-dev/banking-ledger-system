# Banking Ledger System

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A robust backend API for a banking-style ledger and transaction management system. Built with Node.js, Express, and MongoDB, this system provides secure user authentication, account management, and idempotent transaction processing.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Account Management**: Create and manage user accounts with status tracking
- **Transaction Processing**: Idempotent transaction creation with ledger-based recording
- **Email Notifications**: Automated email notifications for transaction events
- **Middleware Security**: Authentication middleware for protected routes
- **Database Integration**: MongoDB with Mongoose ODM for data persistence
- **Error Handling**: Comprehensive error handling and validation

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs for password hashing
- **Email**: Nodemailer for email services
- **Environment**: dotenv for configuration management

## 📁 Project Structure

```
advance_back/
├── src/
│   ├── app.js                 # Main Express application setup
│   ├── config/
│   │   └── db.js              # Database connection configuration
│   ├── controllers/
│   │   ├── account.controller.js    # Account-related business logic
│   │   ├── auth.controller.js       # Authentication logic
│   │   └── transaction.controller.js # Transaction processing
│   ├── middleware/
│   │   └── auth.middleware.js       # JWT authentication middleware
│   ├── models/
│   │   ├── account.model.js         # Account schema and methods
│   │   ├── ledger.model.js          # Ledger entry schema
│   │   ├── transaction.model.js     # Transaction schema
│   │   └── user.model.js            # User schema
│   ├── routes/
│   │   ├── account.js               # Account routes
│   │   ├── auth.routes.js           # Authentication routes
│   │   └── transaction.routes.js    # Transaction routes
│   └── services/
│       └── email.service.js         # Email notification service
├── server.js               # Server entry point
├── package.json            # Dependencies and scripts
├── README.md               # Project documentation
└── .env                    # Environment variables (not committed)
```

## 📋 Prerequisites

- Node.js (v18.x or higher)
- MongoDB (v7.x or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devansharya-dev/banking-ledger-system.git
   cd banking-ledger-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/banking_ledger
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Start MongoDB**
   Ensure MongoDB is running on your system.

5. **Run the application**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📖 Usage

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and receive JWT token

#### Accounts
- `POST /api/accounts` - Create a new account (requires authentication)

#### Transactions
- `POST /api/transactions` - Create a new transaction between accounts
- `POST /api/transactions/system/initial-funds` - Add initial funds to an account

### Example API Usage

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Create Transaction:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fromAccount": "account_id",
    "toAccount": "account_id",
    "amount": 100.00,
    "idempotencyKey": "unique_key"
  }'
```

## 🔒 Security Features

- JWT-based authentication for protected routes
- Password hashing with bcryptjs
- Idempotency keys to prevent duplicate transactions
- Input validation and sanitization
- CORS configuration for cross-origin requests

## 🧪 Testing

Currently, no automated tests are implemented. Manual testing can be performed using tools like Postman or curl.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Devansh Arya - [GitHub](https://github.com/devansharya-dev)

Project Link: [https://github.com/devansharya-dev/banking-ledger-system](https://github.com/devansharya-dev/banking-ledger-system)

---

**Note**: This is a backend API only. A frontend application would need to be built separately to interact with these endpoints.

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
