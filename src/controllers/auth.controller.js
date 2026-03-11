const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(422).json({
        message: "User already exists",
        status: "failed",
      });
    }

    // Create user
    const user = await userModel.create({ email, password, name });

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(201).json({
      message: "User created successfully",
      status: "success",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      status: "failed",
      error: error.message,
    });
  }
}

/**
 * user login controller
 * POST /api/auth/login
 */


async function userLoginController(req,res){   // ✅ FIXED NAME
  const {email,password} = req.body;

  const user = await userModel.findOne({email}).select("+password");

  if(!user){
    return res.status(404).json({
      message:"User not found",
      status:"failed"
    });
  }

  const isValidPassword = await user.comparePassword(password);

  if(!isValidPassword){
    return res.status(401).json({
      message:"Invalid password",
      status:"failed"
    });
  }

  // Generate token
  const token = jwt.sign(
    {userId:user._id},
    process.env.JWT_SECRET_KEY,
    {expiresIn:"3d"}
  );

  // Send cookie
  res.cookie("token",token,{httpOnly:true});

  res.status(200).json({
    message:"User logged in successfully",
    status:"success"
  });
  await  emailService.sendTestEmail(user.email,user.name);
}

module.exports = {
  userRegisterController,
  userLoginController,  
};