"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cloudinary_1 = require("../utils/cloudinary");
const router = (0, express_1.Router)();
// Endpoint mapping to /api/v1/admin/...
router.post("/login", authController_1.login);
router.post("/logout", authController_1.logout);
router.get("/me", authMiddleware_1.protectAdmin, authController_1.getMe);
// Secure Cloudinary delete endpoint
router.post("/cloudinary/delete", authMiddleware_1.protectAdmin, async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ success: false, message: "Image URL is required." });
        }
        const success = await (0, cloudinary_1.deleteFromCloudinary)(url);
        if (success) {
            return res.status(200).json({ success: true, message: "Image deleted successfully from Cloudinary." });
        }
        else {
            return res.status(400).json({ success: false, message: "Failed to delete image from Cloudinary or invalid URL." });
        }
    }
    catch (error) {
        console.error("Cloudinary Delete Route Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error." });
    }
});
exports.default = router;
