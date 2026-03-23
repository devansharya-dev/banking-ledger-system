const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  // Accept JWTs from either an HTTP-only cookie or a Bearer token header.
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "failed",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "failed",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "failed",
    });
  }
}

async function authsystemMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "failed",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.userId).select("+systemUser");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "failed",
      });
    }

    if (!user.systemUser) {
      return res.status(403).json({
        message: "Forbidden user is not system user",
        status: "failed",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized user is not system user",
      status: "failed",
    });
  }
}

module.exports = {
  authMiddleware,
  authsystemMiddleware,
};
