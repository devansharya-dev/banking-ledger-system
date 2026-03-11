const {Router} = require('express');
const  authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");


const Transactionroutes=Router();

/**
 * POST /api/transactions
 * -create new transaction
 */

Transactionroutes.post("/", authMiddleware.authMiddleware, transactionController.createTransaction);


/**
 * POST /api/transactions/system/initial-funds
 * -create initial funds for system user
 */

Transactionroutes.post(
    "/system/initial-funds",
    authMiddleware.authsystemMiddleware,
    transactionController.createInitialFundsTransaction
);


module.exports = Transactionroutes;
