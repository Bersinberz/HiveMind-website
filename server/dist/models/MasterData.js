"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterData = void 0;
const mongoose_1 = require("mongoose");
const masterDataSchema = new mongoose_1.Schema({
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values: ["department", "section", "batch", "year", "domain", "techstack", "programming_language"],
            message: "Category must be department, section, batch, year, domain, techstack, or programming_language"
        }
    },
    value: {
        type: String,
        required: [true, "Value is required"],
        trim: true
    }
}, {
    timestamps: true
});
// Compound index to guarantee uniqueness of value within a specific category
masterDataSchema.index({ category: 1, value: 1 }, { unique: true });
exports.MasterData = (0, mongoose_1.model)("MasterData", masterDataSchema);
exports.default = exports.MasterData;
