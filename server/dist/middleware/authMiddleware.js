"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const protectAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Authentication required. Please log in." });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ success: false, message: "Server configuration error: JWT Secret is missing." });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // Retrieve admin user and attach to request
        const adminDoc = await Admin_1.default.findById(decoded.id).select("-password");
        if (!adminDoc) {
            return res.status(401).json({ success: false, message: "User session not found." });
        }
        req.admin = adminDoc;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Session expired or invalid. Please log in again." });
    }
};
exports.protectAdmin = protectAdmin;
