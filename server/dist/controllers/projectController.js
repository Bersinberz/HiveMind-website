"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjects = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const Domain_1 = __importDefault(require("../models/Domain"));
const Technology_1 = __importDefault(require("../models/Technology"));
const cloudinary_1 = require("../utils/cloudinary");
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
// GET /api/v1/projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project_1.default.find({}).sort({ startDate: -1 });
        return res.status(200).json({ success: true, projects });
    }
    catch (error) {
        console.error("Fetch Projects Error: ", error);
        return res.status(500).json({ success: false, message: "Internal server error fetching projects." });
    }
};
exports.getProjects = getProjects;
// POST /api/v1/projects
const createProject = async (req, res) => {
    try {
        const { title, description, domain, techStack, github, liveDemo, thumbnail, startDate, endDate } = req.body;
        // 1. Check required fields
        if (!title || !description || !domain || !techStack || !github || !thumbnail || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Title, description, domain, tech stack, github, thumbnail, start date, and end date are required." });
        }
        // 2. Validate lengths
        if (title.trim().length < 3) {
            return res.status(400).json({ success: false, message: "Project title must be at least 3 characters." });
        }
        if (description.trim().length < 10) {
            return res.status(400).json({ success: false, message: "Project description must be at least 10 characters." });
        }
        // 3. Validate Domain array/strings
        let domainParsed = [];
        if (Array.isArray(domain)) {
            domainParsed = domain.map(d => d.trim()).filter(Boolean);
        }
        else if (typeof domain === "string") {
            domainParsed = domain.split(",").map(d => d.trim()).filter(Boolean);
        }
        if (domainParsed.length === 0) {
            return res.status(400).json({ success: false, message: "Please select at least one domain." });
        }
        // 4. Validate Tech Stack array/strings
        let techStackParsed = [];
        if (Array.isArray(techStack)) {
            techStackParsed = techStack.map(t => t.trim()).filter(Boolean);
        }
        else if (typeof techStack === "string") {
            techStackParsed = techStack.split(",").map(t => t.trim()).filter(Boolean);
        }
        if (techStackParsed.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide a valid tech stack with at least one technology." });
        }
        // 5. Validate URLs
        if (!urlRegex.test(github)) {
            return res.status(400).json({ success: false, message: "Please provide a valid GitHub URL." });
        }
        if (liveDemo && liveDemo.trim() !== "" && !urlRegex.test(liveDemo)) {
            return res.status(400).json({ success: false, message: "Please provide a valid Live Demo URL." });
        }
        // Resolve Domain and Technology ObjectIds
        const domainObjects = await Domain_1.default.find({
            name: { $in: domainParsed.map(d => new RegExp(`^${escapeRegex(d)}$`, "i")) }
        });
        const domainIds = domainObjects.map(d => d._id);
        const techObjects = await Technology_1.default.find({
            name: { $in: techStackParsed.map(t => new RegExp(`^${escapeRegex(t)}$`, "i")) }
        });
        const techIds = techObjects.map(t => t._id);
        const newProject = new Project_1.default({
            title: title.trim(),
            description: description.trim(),
            domain: domainParsed,
            domains: domainIds,
            techStack: techStackParsed,
            technologies: techIds,
            github: github.trim(),
            liveDemo: liveDemo ? liveDemo.trim() : "",
            thumbnail,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });
        await newProject.save();
        return res.status(201).json({
            success: true,
            message: "Project created successfully.",
            project: newProject,
        });
    }
    catch (error) {
        console.error("Create Project Error: ", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error creating project." });
    }
};
exports.createProject = createProject;
// PUT /api/v1/projects/:id
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, domain, techStack, github, liveDemo, thumbnail, startDate, endDate } = req.body;
        const project = await Project_1.default.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }
        // Validations
        if (title !== undefined) {
            if (title.trim().length < 3) {
                return res.status(400).json({ success: false, message: "Project title must be at least 3 characters." });
            }
            project.title = title.trim();
        }
        if (description !== undefined) {
            if (description.trim().length < 10) {
                return res.status(400).json({ success: false, message: "Project description must be at least 10 characters." });
            }
            project.description = description.trim();
        }
        if (domain !== undefined) {
            let domainParsed = [];
            if (Array.isArray(domain)) {
                domainParsed = domain.map(d => d.trim()).filter(Boolean);
            }
            else if (typeof domain === "string") {
                domainParsed = domain.split(",").map(d => d.trim()).filter(Boolean);
            }
            if (domainParsed.length === 0) {
                return res.status(400).json({ success: false, message: "Please select at least one domain." });
            }
            project.domain = domainParsed;
            const domainObjects = await Domain_1.default.find({
                name: { $in: domainParsed.map(d => new RegExp(`^${escapeRegex(d)}$`, "i")) }
            });
            project.domains = domainObjects.map(d => d._id);
        }
        if (techStack !== undefined) {
            let techStackParsed = [];
            if (Array.isArray(techStack)) {
                techStackParsed = techStack.map(t => t.trim()).filter(Boolean);
            }
            else if (typeof techStack === "string") {
                techStackParsed = techStack.split(",").map(t => t.trim()).filter(Boolean);
            }
            if (techStackParsed.length === 0) {
                return res.status(400).json({ success: false, message: "Please provide a valid tech stack with at least one technology." });
            }
            project.techStack = techStackParsed;
            const techObjects = await Technology_1.default.find({
                name: { $in: techStackParsed.map(t => new RegExp(`^${escapeRegex(t)}$`, "i")) }
            });
            project.technologies = techObjects.map(t => t._id);
        }
        if (github !== undefined) {
            if (!urlRegex.test(github)) {
                return res.status(400).json({ success: false, message: "Please provide a valid GitHub URL." });
            }
            project.github = github.trim();
        }
        if (liveDemo !== undefined) {
            if (liveDemo && liveDemo.trim() !== "" && !urlRegex.test(liveDemo)) {
                return res.status(400).json({ success: false, message: "Please provide a valid Live Demo URL." });
            }
            project.liveDemo = liveDemo ? liveDemo.trim() : "";
        }
        let oldThumbnailUrl = "";
        if (thumbnail !== undefined) {
            if (thumbnail !== project.thumbnail && project.thumbnail) {
                oldThumbnailUrl = project.thumbnail;
            }
            project.thumbnail = thumbnail;
        }
        if (startDate !== undefined) {
            project.startDate = new Date(startDate);
        }
        if (endDate !== undefined) {
            project.endDate = new Date(endDate);
        }
        await project.save();
        if (oldThumbnailUrl) {
            (0, cloudinary_1.deleteFromCloudinary)(oldThumbnailUrl).catch(err => console.error("Error deleting old project thumbnail from Cloudinary:", err));
        }
        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            project,
        });
    }
    catch (error) {
        console.error("Update Project Error: ", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error updating project." });
    }
};
exports.updateProject = updateProject;
// DELETE /api/v1/projects/:id
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project_1.default.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }
        const thumbnailUrl = project.thumbnail;
        await Project_1.default.findByIdAndDelete(id);
        if (thumbnailUrl) {
            (0, cloudinary_1.deleteFromCloudinary)(thumbnailUrl).catch(err => console.error("Error deleting project thumbnail from Cloudinary:", err));
        }
        return res.status(200).json({ success: true, message: "Project deleted successfully." });
    }
    catch (error) {
        console.error("Delete Project Error: ", error);
        return res.status(500).json({ success: false, message: "Internal server error deleting project." });
    }
};
exports.deleteProject = deleteProject;
