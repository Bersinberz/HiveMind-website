import { Router } from "express";
import { recordVisit, getDashboardStats } from "../controllers/telemetryController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public route to log visitor page views
router.post("/visit", recordVisit);

// Protected admin dashboard telemetry statistics route
router.get("/stats", protectAdmin, getDashboardStats);

export default router;
