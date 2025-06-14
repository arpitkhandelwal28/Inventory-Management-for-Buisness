const User = require("../models/userModel");
const Item = require("../models/itemModel");

const promoteToAdmin = async (req, res) => {
	try {
		const { userId } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (user.role === "admin") {
			return res.status(400).json({ success: false, message: "User is already an admin" });
		}

		user.role = "admin";
		await user.save();

		res.status(200).json({
			success: true,
			message: "User promoted to admin successfully",
			user,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const dashboard = async (req , res) => {
	res.status(200).json({
		success: true,
		message: "welcome to admin dashboard"
	});
};

const getInventory = async (req, res) => {
    try {
        const inventory = await Item.find(); // Fetch all inventory items
        res.status(200).json({ success: true, inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {promoteToAdmin , dashboard, getInventory};
