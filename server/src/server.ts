import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { seedDomainsAndTechnologies } from "./utils/seedMasterData";
import authRoutes from "./routes/authRoutes";
import teamRoutes from "./routes/teamRoutes";
import projectRoutes from "./routes/projectRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import communitySettingsRoutes from "./routes/communitySettingsRoutes";
import masterDataRoutes from "./routes/masterDataRoutes";
import telemetryRoutes from "./routes/telemetryRoutes";
import domainRoutes from "./routes/domainRoutes";
import technologyRoutes from "./routes/technologyRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database & Seed Master Data
connectDB().then(() => {
    seedDomainsAndTechnologies();
});

// Middlewares
app.use(
    cors({
        origin: "http://localhost:5173", // Allow react dev client
        credentials: true, // Crucial to allow HttpOnly cookies cross-origin
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/v1/admin", authRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/community-settings", communitySettingsRoutes);
app.use("/api/v1/master-data", masterDataRoutes);
app.use("/api/v1/telemetry", telemetryRoutes);
app.use("/api/v1/domains", domainRoutes);
app.use("/api/v1/technologies", technologyRoutes);

// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "HiveMind Admin Authentication Server" });
});

// Run Server
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
