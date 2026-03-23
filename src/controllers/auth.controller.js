const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body;

    // Prevent duplicate accounts from being created for the same email.
    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(422).json({
        message: "User already exists",
        status: "failed",
      });
    }

    // Password hashing is handled by the user model before save.
    const user = await userModel.create({ email, password, name });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(201).json({
      message: "User created successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      status: "failed",
      error: error.message,
    });
  }
}

/**
 * Authenticate a user and issue a JWT-backed session cookie.
 */
async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password",
        status: "failed",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      message: "User logged in successfully",
      status: "success",
    });

    // Treat login email as best-effort so auth success does not depend on mail delivery.
    await emailService.sendTestEmail(user.email, user.name);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      status: "failed",
      error: error.message,
    });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
};
