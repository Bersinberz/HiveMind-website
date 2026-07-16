"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route to view projects
router.get("/", projectController_1.getProjects);
// Protected routes to manage projects
router.post("/", authMiddleware_1.protectAdmin, projectController_1.createProject);
router.put("/:id", authMiddleware_1.protectAdmin, projectController_1.updateProject);
router.delete("/:id", authMiddleware_1.protectAdmin, projectController_1.deleteProject);
exports.default = router;
