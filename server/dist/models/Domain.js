"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Domain = void 0;
const mongoose_1 = require("mongoose");
const domainSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Domain name is required"],
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: [true, "Domain slug is required"],
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    technologies: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Technology",
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Indexes
domainSchema.index({ isActive: 1 });
exports.Domain = (0, mongoose_1.model)("Domain", domainSchema);
exports.default = exports.Domain;
