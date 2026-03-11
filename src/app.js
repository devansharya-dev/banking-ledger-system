// two use of this file 1- create the server 2- config the server

const express = require('express');
const cookieParser = require('cookie-parser');




const app = express();
app.use(cookieParser());
app.use(express.json());

/**
 * - routes required 
 * 
 */
const authRoutes = require('./routes/auth.routes');
const  accountRoutes = require('./routes/account.js'); 
const transactionRoutes = require('./routes/transaction.routes');


/**
 * user routes
 *  - register
 *  - login
 */



app.use("/api/auth",authRoutes)
app.use("/api/accounts",accountRoutes)
app.use("/api/transactions", transactionRoutes)

module.exports = app;
