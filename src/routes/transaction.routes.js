const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");

const transactionRoutes = Router();

// Standard authenticated transfer endpoint.
transactionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction
);

// Funding endpoint reserved for internal/system users.
transactionRoutes.post(
  "/system/initial-funds",
  authMiddleware.authsystemMiddleware,
  transactionController.createInitialFundsTransaction
);

module.exports = transactionRoutes;
