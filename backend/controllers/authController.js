const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { generateTokenAndSetCookie } = require("../utils/generateTokenAndSetCookie");
const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../MailTrap/email");

const User = require("../models/userModel");

// SIGNUP
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const hashedVerificationToken = await bcryptjs.hash(verificationToken, 10);

    const user = new User({
      email,
      password: hashedPassword,
      verificationToken: hashedVerificationToken,
      verificationTokenExpiresAt: Date.now() + 86400000,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    generateTokenAndSetCookie(res, user._id, user.role);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully. Verification email sent.",
      token,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const users = await User.find({ verificationTokenExpiresAt: { $gt: Date.now() } });

    let targetUser = null;
    for (const user of users) {
      const isMatch = await bcryptjs.compare(code, user.verificationToken);
      if (isMatch) {
        targetUser = user;
        break;
      }
    }

    if (!targetUser) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    targetUser.isVerified = true;
    targetUser.verificationToken = undefined;
    targetUser.verificationTokenExpiresAt = undefined;
    await targetUser.save();

    await sendWelcomeEmail(targetUser.email);
    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    generateTokenAndSetCookie(res, user._id, user.role);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedResetToken = await bcryptjs.hash(resetToken, 10);

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, `https://inventory-management-for-buisness-2.onrender.com/reset-password/${resetToken}`);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// RESET PASSWORD (fully fixed bcrypt loop version)
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const users = await User.find({ resetPasswordExpiresAt: { $gt: Date.now() } });

    let targetUser = null;
    for (const user of users) {
      const isMatch = await bcryptjs.compare(token, user.resetPasswordToken);
      if (isMatch) {
        targetUser = user;
        break;
      }
    }

    if (!targetUser) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    targetUser.password = await bcryptjs.hash(password, 10);
    targetUser.resetPasswordToken = undefined;
    targetUser.resetPasswordExpiresAt = undefined;
    await targetUser.save();

    await sendResetSuccessEmail(targetUser.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CHECK AUTH (simple protected route)
const checkAuth = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
};
