"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMasterData = exports.addMasterData = exports.getMasterData = void 0;
const MasterData_1 = __importDefault(require("../models/MasterData"));
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
const getMasterData = async (req, res) => {
    try {
        let count = await MasterData_1.default.countDocuments();
        if (count === 0) {
            // Seed defaults if empty
            await MasterData_1.default.insertMany(DEFAULT_MASTER_DATA);
        }
        const langCount = await MasterData_1.default.countDocuments({ category: "programming_language" });
        if (langCount === 0) {
            const languages = [
                { category: "programming_language", value: "Python" },
                { category: "programming_language", value: "JavaScript" },
                { category: "programming_language", value: "TypeScript" },
                { category: "programming_language", value: "C++" },
                { category: "programming_language", value: "Java" },
                { category: "programming_language", value: "Go" },
                { category: "programming_language", value: "Rust" },
                { category: "programming_language", value: "C#" },
                { category: "programming_language", value: "PHP" },
                { category: "programming_language", value: "Swift" },
                { category: "programming_language", value: "Kotlin" },
                { category: "programming_language", value: "Ruby" }
            ];
            await MasterData_1.default.insertMany(languages);
        }
        const data = await MasterData_1.default.find().sort({ category: 1, value: 1 });
        return res.status(200).json({
            success: true,
            data
        });
    }
    catch (error) {
        console.error("Get Master Data Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve master data."
        });
    }
};
exports.getMasterData = getMasterData;
/**
 * @desc    Add Master Data Option
 * @route   POST /api/v1/master-data
 * @access  Private/Admin
 */
const addMasterData = async (req, res) => {
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
        const existing = await MasterData_1.default.findOne({ category, value: normalizedValue });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Option "${normalizedValue}" already exists in ${category}.`
            });
        }
        const option = await MasterData_1.default.create({
            category,
            value: normalizedValue
        });
        return res.status(201).json({
            success: true,
            message: "Option added successfully.",
            option
        });
    }
    catch (error) {
        console.error("Add Master Data Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add master data option."
        });
    }
};
exports.addMasterData = addMasterData;
/**
 * @desc    Delete Master Data Option
 * @route   DELETE /api/v1/master-data/:id
 * @access  Private/Admin
 */
const deleteMasterData = async (req, res) => {
    try {
        const { id } = req.params;
        const option = await MasterData_1.default.findById(id);
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
    }
    catch (error) {
        console.error("Delete Master Data Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete master data option."
        });
    }
};
exports.deleteMasterData = deleteMasterData;
