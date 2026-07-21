"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.recordVisit = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const Project_1 = __importDefault(require("../models/Project"));
const Application_1 = __importDefault(require("../models/Application"));
const Visitor_1 = __importDefault(require("../models/Visitor"));
/**
 * @desc    Record page visit hit
 * @route   POST /api/v1/telemetry/visit
 * @access  Public
 */
const recordVisit = async (req, res) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
        const userAgent = req.headers["user-agent"] || "";
        const path = req.body.path || "/";
        const newVisit = new Visitor_1.default({
            ip: ip.split(",")[0].trim(),
            userAgent,
            path,
        });
        await newVisit.save();
        return res.status(200).json({ success: true });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.recordVisit = recordVisit;
/**
 * @desc    Get dashboard metrics & telemetry statistics
 * @route   GET /api/v1/telemetry/stats
 * @access  Private (Admin)
 */
const getDashboardStats = async (req, res) => {
    try {
        const totalMembers = await Team_1.default.countDocuments();
        const totalProjects = await Project_1.default.countDocuments();
        const pendingApplications = await Application_1.default.countDocuments({ status: "Pending" });
        const totalVisitors = await Visitor_1.default.countDocuments();
        // Query recent records across team, projects, and applications
        const [recentMembers, recentProjects, recentApps] = await Promise.all([
            Team_1.default.find().sort({ createdAt: -1 }).limit(5),
            Project_1.default.find().sort({ createdAt: -1 }).limit(5),
            Application_1.default.find().sort({ createdAt: -1 }).limit(5),
        ]);
        const activities = [];
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
        const deptStats = await Team_1.default.aggregate([
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
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getDashboardStats = getDashboardStats;
