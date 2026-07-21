"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMasterData = exports.addMasterData = exports.getMasterData = void 0;
const MasterData_1 = __importDefault(require("../models/MasterData"));
const getMasterData = async (req, res) => {
    try {
        const data = await MasterData_1.default.find().sort({ category: 1, value: 1 });
        return res.status(200).json({
            success: true,
            data
        });
    }
    catch (error) {
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
        return res.status(500).json({
            success: false,
            message: "Failed to delete master data option."
        });
    }
};
exports.deleteMasterData = deleteMasterData;
