import { Request, Response } from "express";
import Project from "../models/Project";
import Domain from "../models/Domain";
import Technology from "../models/Technology";
import { deleteFromCloudinary } from "../utils/cloudinary";
 
const escapeRegex = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

// GET /api/v1/projects
export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find({}).sort({ startDate: -1 });
        return res.status(200).json({ success: true, projects });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error fetching projects." });
    }
};

// POST /api/v1/projects
export const createProject = async (req: Request, res: Response) => {
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
        let domainParsed: string[] = [];
        if (Array.isArray(domain)) {
            domainParsed = domain.map(d => d.trim()).filter(Boolean);
        } else if (typeof domain === "string") {
            domainParsed = domain.split(",").map(d => d.trim()).filter(Boolean);
        }
        if (domainParsed.length === 0) {
            return res.status(400).json({ success: false, message: "Please select at least one domain." });
        }

        // 4. Validate Tech Stack array/strings
        let techStackParsed: string[] = [];
        if (Array.isArray(techStack)) {
            techStackParsed = techStack.map(t => t.trim()).filter(Boolean);
        } else if (typeof techStack === "string") {
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
        const domainObjects = await Domain.find({
            name: { $in: domainParsed.map(d => new RegExp(`^${escapeRegex(d)}$`, "i")) }
        });
        const domainIds = domainObjects.map(d => d._id);

        const techObjects = await Technology.find({
            name: { $in: techStackParsed.map(t => new RegExp(`^${escapeRegex(t)}$`, "i")) }
        });
        const techIds = techObjects.map(t => t._id);

        const newProject = new Project({
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
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error creating project." });
    }
};

// PUT /api/v1/projects/:id
export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, domain, techStack, github, liveDemo, thumbnail, startDate, endDate } = req.body;

        const project = await Project.findById(id);
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
            let domainParsed: string[] = [];
            if (Array.isArray(domain)) {
                domainParsed = domain.map(d => d.trim()).filter(Boolean);
            } else if (typeof domain === "string") {
                domainParsed = domain.split(",").map(d => d.trim()).filter(Boolean);
            }
            if (domainParsed.length === 0) {
                return res.status(400).json({ success: false, message: "Please select at least one domain." });
            }
            project.domain = domainParsed;

            const domainObjects = await Domain.find({
                name: { $in: domainParsed.map(d => new RegExp(`^${escapeRegex(d)}$`, "i")) }
            });
            project.domains = domainObjects.map(d => d._id);
        }

        if (techStack !== undefined) {
            let techStackParsed: string[] = [];
            if (Array.isArray(techStack)) {
                techStackParsed = techStack.map(t => t.trim()).filter(Boolean);
            } else if (typeof techStack === "string") {
                techStackParsed = techStack.split(",").map(t => t.trim()).filter(Boolean);
            }
            if (techStackParsed.length === 0) {
                return res.status(400).json({ success: false, message: "Please provide a valid tech stack with at least one technology." });
            }
            project.techStack = techStackParsed;

            const techObjects = await Technology.find({
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
            deleteFromCloudinary(oldThumbnailUrl).catch(err => 
                {}
            );
        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            project,
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error updating project." });
    }
};

// DELETE /api/v1/projects/:id
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        const thumbnailUrl = project.thumbnail;

        await Project.findByIdAndDelete(id);

        if (thumbnailUrl) {
            deleteFromCloudinary(thumbnailUrl).catch(err => 
                {}
            );
        }

        return res.status(200).json({ success: true, message: "Project deleted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error deleting project." });
    }
};
