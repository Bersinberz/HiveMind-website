"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
// Configure dotenv before importing models so variables are loaded
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
const Admin_1 = __importDefault(require("../models/Admin"));
const seedAdmin = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        console.log("Connecting to database for seeding...");
        await mongoose_1.default.connect(uri);
        console.log("Connected successfully.");
        const adminEmail = "bersin@gmail.com";
        const existingAdmin = await Admin_1.default.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`Admin user with email ${adminEmail} already exists. Skipping seed.`);
        }
        else {
            console.log("Creating default admin user...");
            await Admin_1.default.create({
                name: "Bersin Berz",
                email: adminEmail,
                password: "Bersin@02092004", // Automatically hashed by Mongoose schema pre-save hook
                role: "admin",
            });
            console.log("Admin user seeded successfully!");
        }
        await mongoose_1.default.connection.close();
        console.log("Seeding complete. Connection closed.");
        process.exit(0);
    }
    catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};
seedAdmin();
