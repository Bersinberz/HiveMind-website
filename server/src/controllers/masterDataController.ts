import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import MasterData from "../models/MasterData";

const DEFAULT_MASTER_DATA = [
    // Departments
    { category: "department", value: "CSE" },
    { category: "department", value: "IT" },
    { category: "department", value: "ECE" },
    { category: "department", value: "EEE" },
    { category: "department", value: "Mech" },
    { category: "department", value: "BioTech" },
    // Sections
    { category: "section", value: "A" },
    { category: "section", value: "B" },
    { category: "section", value: "C" },
    { category: "section", value: "D" },
    // Batches
    { category: "batch", value: "2021-2025" },
    { category: "batch", value: "2022-2026" },
    { category: "batch", value: "2023-2027" },
    { category: "batch", value: "2024-2028" },
    // Years
    { category: "year", value: "1st" },
    { category: "year", value: "2nd" },
    { category: "year", value: "3rd" },
    { category: "year", value: "4th" },
    // Domains
    { category: "domain", value: "Web Development" },
    { category: "domain", value: "Mobile App Development" },
    { category: "domain", value: "Machine Learning" },
    { category: "domain", value: "Computer Vision" },
    { category: "domain", value: "Cybersecurity" },
    { category: "domain", value: "Cloud Computing" },
    // Tech Stack
    { category: "techstack", value: "React" },
    { category: "techstack", value: "Node.js" },
    { category: "techstack", value: "Python" },
    { category: "techstack", value: "PyTorch" },
    { category: "techstack", value: "TensorFlow" },
    { category: "techstack", value: "Django" },
    { category: "techstack", value: "Flutter" },
    { category: "techstack", value: "Docker" },
    { category: "techstack", value: "Kubernetes" },
    { category: "techstack", value: "AWS" }
];

/**
 * @desc    Get Master Data Options
 * @route   GET /api/v1/master-data
 * @access  Public
 */
export const getMasterData = async (req: AuthRequest, res: Response) => {
    try {
        let count = await MasterData.countDocuments();
        if (count === 0) {
            // Seed defaults if empty
            await MasterData.insertMany(DEFAULT_MASTER_DATA);
        }
        const data = await MasterData.find().sort({ category: 1, value: 1 });
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error: any) {
        console.error("Get Master Data Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve master data."
        });
    }
};

/**
 * @desc    Add Master Data Option
 * @route   POST /api/v1/master-data
 * @access  Private/Admin
 */
export const addMasterData = async (req: AuthRequest, res: Response) => {
    try {
        const { category, value } = req.body;

        if (!category || !value) {
            return res.status(400).json({
                success: false,
                message: "Category and value are required."
            });
        }

        const normalizedValue = value.trim();
        
        // Check if already exists
        const existing = await MasterData.findOne({ category, value: normalizedValue });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Option "${normalizedValue}" already exists in ${category}.`
            });
        }

        const option = await MasterData.create({
            category,
            value: normalizedValue
        });

        return res.status(201).json({
            success: true,
            message: "Option added successfully.",
            option
        });
    } catch (error: any) {
        console.error("Add Master Data Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add master data option."
        });
    }
};

/**
 * @desc    Delete Master Data Option
 * @route   DELETE /api/v1/master-data/:id
 * @access  Private/Admin
 */
export const deleteMasterData = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const option = await MasterData.findById(id);
        if (!option) {
            return res.status(404).json({
                success: false,
                message: "Master data option not found."
            });
        }

        await option.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Option deleted successfully."
        });
    } catch (error: any) {
        console.error("Delete Master Data Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete master data option."
        });
    }
};
