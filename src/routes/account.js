const  express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");    
const accountController = require("../controllers/account.controller");

const router = express.Router();

/**
 * POST /api/accounts/
 *  this route is for creating a new account 
 *  this route is protected by auth middleware
 */


router.post("/", authMiddleware.authMiddleware, accountController.createAccount);





module.exports = router
