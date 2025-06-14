const express = require("express");
const adminOnly = require("../middlewares/adminOnly");
const { verifyToken } = require("../middlewares/verifyToken");
const { promoteToAdmin, dashboard, getInventory } = require("../controllers/adminController");
const bcryptjs = require("bcryptjs");
const User = require("../models/userModel");  
const router = express.Router();

router.get("/dashboard", verifyToken, adminOnly, dashboard);
router.post("/promote", verifyToken, adminOnly, promoteToAdmin);
router.post("/create-admin", async (req, res) => {
  console.log("Request Body:", req.body); 
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    
    const existingAdmin = await User.findOne({ email, role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    const admin = new User({
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    
    await admin.save();
    res.status(201).json({ success: true, message: "Admin account created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/inventory", verifyToken, adminOnly, getInventory);

module.exports = router;
