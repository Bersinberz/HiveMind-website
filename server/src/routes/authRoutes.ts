import { Router } from "express";
import { login, logout, getMe } from "../controllers/authController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

// Endpoint mapping to /api/v1/admin/...
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectAdmin, getMe);

export default router;
