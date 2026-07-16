"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const communitySettingsController_1 = require("../controllers/communitySettingsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route to fetch settings
router.get("/", communitySettingsController_1.getCommunitySettings);
// Protected route to update settings
router.put("/", authMiddleware_1.protectAdmin, communitySettingsController_1.updateCommunitySettings);
exports.default = router;
