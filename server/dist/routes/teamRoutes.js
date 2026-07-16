"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamController_1 = require("../controllers/teamController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route to view team members
router.get("/", teamController_1.getTeamMembers);
// Protected routes to manage team members
router.post("/", authMiddleware_1.protectAdmin, teamController_1.createTeamMember);
router.put("/:id", authMiddleware_1.protectAdmin, teamController_1.updateTeamMember);
router.delete("/:id", authMiddleware_1.protectAdmin, teamController_1.deleteTeamMember);
exports.default = router;
