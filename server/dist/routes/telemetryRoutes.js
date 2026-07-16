"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const telemetryController_1 = require("../controllers/telemetryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route to log visitor page views
router.post("/visit", telemetryController_1.recordVisit);
// Protected admin dashboard telemetry statistics route
router.get("/stats", authMiddleware_1.protectAdmin, telemetryController_1.getDashboardStats);
exports.default = router;
