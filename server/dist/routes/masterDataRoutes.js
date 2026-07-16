"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const masterDataController_1 = require("../controllers/masterDataController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route to retrieve master data configuration
router.get("/", masterDataController_1.getMasterData);
// Protected routes to manage master data options
router.post("/", authMiddleware_1.protectAdmin, masterDataController_1.addMasterData);
router.delete("/:id", authMiddleware_1.protectAdmin, masterDataController_1.deleteMasterData);
exports.default = router;
