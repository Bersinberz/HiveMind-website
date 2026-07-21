"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTechnology = exports.updateTechnology = exports.createTechnology = exports.getTechnologyById = exports.getTechnologies = void 0;
const Domain_1 = __importDefault(require("../models/Domain"));
const Technology_1 = __importDefault(require("../models/Technology"));
const Project_1 = __importDefault(require("../models/Project"));
const slugify_1 = require("../utils/slugify");
/**
 * @desc    Get all Technologies
 * @route   GET /api/v1/technologies
 * @access  Public
 */
const getTechnologies = async (req, res) => {
    try {
        const { domains } = req.query;
        const query = {};
        // Filter technologies by domain list if provided
        if (domains) {
            const domainIds = domains
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);
            if (domainIds.length > 0) {
                query.domains = { $in: domainIds };
            }
        }
        const technologies = await Technology_1.default.find(query)
            .populate("domains", "name slug isActive")
            .sort({ sortOrder: 1, name: 1 });
        return res.status(200).json({
            success: true,
            data: technologies,
        });
    }
    catch (error) {
        console.error("Get Technologies Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve technologies.",
        });
    }
};
exports.getTechnologies = getTechnologies;
/**
 * @desc    Get Technology by ID
 * @route   GET /api/v1/technologies/:id
 * @access  Public
 */
const getTechnologyById = async (req, res) => {
    try {
        const { id } = req.params;
        const technology = await Technology_1.default.findById(id).populate("domains", "name slug isActive");
        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: technology,
        });
    }
    catch (error) {
        console.error("Get Technology By ID Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve technology.",
        });
    }
};
exports.getTechnologyById = getTechnologyById;
/**
 * @desc    Create Technology
 * @route   POST /api/v1/technologies
 * @access  Private/Admin
 */
const createTechnology = async (req, res) => {
    try {
        const { name, description, domains, isActive, sortOrder } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Technology name is required.",
            });
        }
        const normalizedName = name.trim();
        const slug = (0, slugify_1.slugify)(normalizedName);
        // Case-insensitive name duplicate check
        const existingName = await Technology_1.default.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
        });
        if (existingName) {
            return res.status(400).json({
                success: false,
                message: `Technology name "${normalizedName}" already exists.`,
            });
        }
        // Case-insensitive slug duplicate check
        const existingSlug = await Technology_1.default.findOne({ slug });
        if (existingSlug) {
            return res.status(400).json({
                success: false,
                message: `Technology slug "${slug}" already exists.`,
            });
        }
        // Validate domains array
        const domainIds = Array.isArray(domains) ? domains : [];
        const newTech = await Technology_1.default.create({
            name: normalizedName,
            slug,
            description: description ? description.trim() : "",
            domains: domainIds,
            isActive: isActive !== false,
            sortOrder: Number(sortOrder) || 0,
        });
        // Sync reverse relationships in Domain documents
        if (domainIds.length > 0) {
            await Domain_1.default.updateMany({ _id: { $in: domainIds } }, { $addToSet: { technologies: newTech._id } });
        }
        return res.status(201).json({
            success: true,
            message: "Technology created successfully.",
            data: newTech,
        });
    }
    catch (error) {
        console.error("Create Technology Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create technology.",
        });
    }
};
exports.createTechnology = createTechnology;
/**
 * @desc    Update Technology
 * @route   PUT /api/v1/technologies/:id
 * @access  Private/Admin
 */
const updateTechnology = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, domains, isActive, sortOrder } = req.body;
        const technology = await Technology_1.default.findById(id);
        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found.",
            });
        }
        if (name !== undefined) {
            const normalizedName = name.trim();
            if (!normalizedName) {
                return res.status(400).json({
                    success: false,
                    message: "Technology name cannot be empty.",
                });
            }
            // Case-insensitive duplicate validations if name changed
            if (normalizedName.toLowerCase() !== technology.name.toLowerCase()) {
                const existingName = await Technology_1.default.findOne({
                    name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
                });
                if (existingName) {
                    return res.status(400).json({
                        success: false,
                        message: `Technology name "${normalizedName}" already exists.`,
                    });
                }
                const slug = (0, slugify_1.slugify)(normalizedName);
                const existingSlug = await Technology_1.default.findOne({ slug });
                if (existingSlug) {
                    return res.status(400).json({
                        success: false,
                        message: `Technology slug "${slug}" already exists.`,
                    });
                }
                technology.name = normalizedName;
                technology.slug = slug;
            }
        }
        if (description !== undefined) {
            technology.description = description ? description.trim() : "";
        }
        if (isActive !== undefined) {
            technology.isActive = isActive === true;
        }
        if (sortOrder !== undefined) {
            technology.sortOrder = Number(sortOrder) || 0;
        }
        // Sync domains many-to-many relationship
        if (domains !== undefined && Array.isArray(domains)) {
            const newDomainIds = domains.map(dId => dId.toString());
            const oldDomainIds = technology.domains.map(dId => dId.toString());
            const toRemove = oldDomainIds.filter(id => !newDomainIds.includes(id));
            const toAdd = newDomainIds.filter(id => !oldDomainIds.includes(id));
            // Pull technology reference from unselected domains
            if (toRemove.length > 0) {
                await Domain_1.default.updateMany({ _id: { $in: toRemove } }, { $pull: { technologies: technology._id } });
            }
            // Push technology reference to newly selected domains
            if (toAdd.length > 0) {
                await Domain_1.default.updateMany({ _id: { $in: toAdd } }, { $addToSet: { technologies: technology._id } });
            }
            technology.domains = domains;
        }
        await technology.save();
        const updatedTech = await Technology_1.default.findById(id).populate("domains", "name slug isActive");
        return res.status(200).json({
            success: true,
            message: "Technology updated successfully.",
            data: updatedTech,
        });
    }
    catch (error) {
        console.error("Update Technology Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update technology.",
        });
    }
};
exports.updateTechnology = updateTechnology;
/**
 * @desc    Delete Technology
 * @route   DELETE /api/v1/technologies/:id
 * @access  Private/Admin
 */
const deleteTechnology = async (req, res) => {
    try {
        const { id } = req.params;
        const { force } = req.query;
        const technology = await Technology_1.default.findById(id);
        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found.",
            });
        }
        // 1. Check if assigned to any projects (backward-compatible checks for ID or Name string)
        const projectCount = await Project_1.default.countDocuments({
            $or: [
                { technologies: id },
                { techStack: technology.name }
            ]
        });
        // 2. Check if linked to any domains
        const linkedDomainCount = technology.domains.length;
        // If referenced, prevent accidental deletion unless forced
        if (force !== "true" && (projectCount > 0 || linkedDomainCount > 0)) {
            return res.status(400).json({
                success: false,
                isReferenced: true,
                message: `This technology is currently used by ${projectCount} project(s) and linked to ${linkedDomainCount} domain(s).`,
                projectCount,
                linkedDomainCount,
            });
        }
        // Remove technology reference from all associated domains
        await Domain_1.default.updateMany({ technologies: id }, { $pull: { technologies: id } });
        // Delete from database
        await technology.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Technology deleted successfully.",
        });
    }
    catch (error) {
        console.error("Delete Technology Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete technology.",
        });
    }
};
exports.deleteTechnology = deleteTechnology;
