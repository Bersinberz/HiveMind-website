"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationController_1 = require("../controllers/applicationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public submission route
router.post("/apply", applicationController_1.applyMember);
// Protected administrative dashboard routes
router.get("/", authMiddleware_1.protectAdmin, applicationController_1.getApplications);
router.put("/:id/status", authMiddleware_1.protectAdmin, applicationController_1.updateApplicationStatus);
router.delete("/:id", authMiddleware_1.protectAdmin, applicationController_1.deleteApplication);
exports.default = router;
