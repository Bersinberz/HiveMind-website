import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import teamRoutes from "./routes/teamRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

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

// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "HiveMind Admin Authentication Server" });
});

// Run Server
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
