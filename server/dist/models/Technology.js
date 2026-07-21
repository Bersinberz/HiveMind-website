"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Technology = void 0;
const mongoose_1 = require("mongoose");
const technologySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Technology name is required"],
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: [true, "Technology slug is required"],
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    domains: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Domain",
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
technologySchema.index({ isActive: 1 });
exports.Technology = (0, mongoose_1.model)("Technology", technologySchema);
exports.default = exports.Technology;
