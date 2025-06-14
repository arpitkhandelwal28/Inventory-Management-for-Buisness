const adminOnly = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    next();
};

module.exports = adminOnly;
