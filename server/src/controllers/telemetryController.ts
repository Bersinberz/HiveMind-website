import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Team from "../models/Team";
import Project from "../models/Project";
import Application from "../models/Application";
import Visitor from "../models/Visitor";

/**
 * @desc    Record page visit hit
 * @route   POST /api/v1/telemetry/visit
 * @access  Public
 */
export const recordVisit = async (req: Request, res: Response) => {
    try {
        const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
        const userAgent = req.headers["user-agent"] || "";
        const path = req.body.path || "/";

        const newVisit = new Visitor({
            ip: ip.split(",")[0].trim(),
            userAgent,
            path,
        });
        await newVisit.save();

        return res.status(200).json({ success: true });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get dashboard metrics & telemetry statistics
 * @route   GET /api/v1/telemetry/stats
 * @access  Private (Admin)
 */
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const totalMembers = await Team.countDocuments();
        const totalProjects = await Project.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: "Pending" });
        const totalVisitors = await Visitor.countDocuments();

        // Query recent records across team, projects, and applications
        const [recentMembers, recentProjects, recentApps] = await Promise.all([
            Team.find().sort({ createdAt: -1 }).limit(5),
            Project.find().sort({ createdAt: -1 }).limit(5),
            Application.find().sort({ createdAt: -1 }).limit(5),
        ]);

        // Merge into structured logs
        interface Activity {
            id: string;
            type: "member" | "project" | "application";
            title: string;
            description: string;
            timestamp: Date;
        }
        
        const activities: Activity[] = [];

        recentMembers.forEach((m) => {
            activities.push({
                id: m._id.toString(),
                type: "member",
                title: "New Team Member Added",
                description: `${m.fullname} joined the ${m.department} department.`,
                timestamp: m.createdAt || new Date(),
            });
        });

        recentProjects.forEach((p) => {
            activities.push({
                id: p._id.toString(),
                type: "project",
                title: "New Project Created",
                description: `Project "${p.title}" was registered under ${p.domain}.`,
                timestamp: p.createdAt || new Date(),
            });
        });

        recentApps.forEach((a) => {
            activities.push({
                id: a._id.toString(),
                type: "application",
                title: "Application Received",
                description: `${a.fullname} applied for HiveMind membership.`,
                timestamp: a.createdAt || new Date(),
            });
        });

        // Sort chronologically descending
        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const recentActivities = activities.slice(0, 6);

        // Fetch department distribution counts
        const deptStats = await Team.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } },
        ]);
        const departmentDistribution = deptStats.map((d) => ({
            department: d._id || "Other",
            count: d.count,
        }));

        return res.status(200).json({
            success: true,
            stats: {
                totalMembers,
                totalProjects,
                pendingApplications,
                totalVisitors,
                recentActivities,
                departmentDistribution,
            },
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
