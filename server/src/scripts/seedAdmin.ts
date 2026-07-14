import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

// Configure dotenv before importing models so variables are loaded
dotenv.config({ path: path.join(__dirname, "../../.env") });

import Admin from "../models/Admin";

const seedAdmin = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        console.log("Connecting to database for seeding...");
        await mongoose.connect(uri);
        console.log("Connected successfully.");

        const adminEmail = "bersin@gmail.com";
        const existingAdmin = await Admin.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`Admin user with email ${adminEmail} already exists. Skipping seed.`);
        } else {
            console.log("Creating default admin user...");
            await Admin.create({
                name: "Bersin Berz",
                email: adminEmail,
                password: "Bersin@02092004", // Automatically hashed by Mongoose schema pre-save hook
                role: "admin",
            });
            console.log("Admin user seeded successfully!");
        }

        await mongoose.connection.close();
        console.log("Seeding complete. Connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedAdmin();
