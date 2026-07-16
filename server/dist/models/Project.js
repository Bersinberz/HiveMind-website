"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Project title is required"],
        minlength: [3, "Project title must be at least 3 characters"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Project description is required"],
        minlength: [10, "Project description must be at least 10 characters"],
        trim: true,
    },
    domain: {
        type: [String],
        required: [true, "Project domain is required"],
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: "Project domain must contain at least one domain",
        },
    },
    techStack: {
        type: [String],
        required: [true, "Tech stack is required"],
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: "Tech stack must contain at least one technology",
        },
    },
    github: {
        type: String,
        required: [true, "GitHub URL is required"],
        trim: true,
    },
    liveDemo: {
        type: String,
        trim: true,
        default: "",
    },
    thumbnail: {
        type: String,
        required: [true, "Project thumbnail is required"],
        trim: true,
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Project", projectSchema);
