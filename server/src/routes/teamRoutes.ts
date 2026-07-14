import { Router } from "express";
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/teamController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public route to view team members
router.get("/", getTeamMembers);

// Protected routes to manage team members
router.post("/", protectAdmin, createTeamMember);
router.put("/:id", protectAdmin, updateTeamMember);
router.delete("/:id", protectAdmin, deleteTeamMember);

export default router;
