const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const accountController = require("../controllers/account.controller");

const router = express.Router();

// Create an account for the currently authenticated user.
router.post("/", authMiddleware.authMiddleware, accountController.createAccount);

module.exports = router;
