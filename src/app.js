const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Parse cookies and JSON bodies before requests reach controllers.
app.use(cookieParser());
app.use(express.json());

// Domain route modules.
const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.js');
const transactionRoutes = require('./routes/transaction.routes');

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

module.exports = app;
