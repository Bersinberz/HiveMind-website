"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const seedMasterData_1 = require("./utils/seedMasterData");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const communitySettingsRoutes_1 = __importDefault(require("./routes/communitySettingsRoutes"));
const masterDataRoutes_1 = __importDefault(require("./routes/masterDataRoutes"));
const telemetryRoutes_1 = __importDefault(require("./routes/telemetryRoutes"));
const domainRoutes_1 = __importDefault(require("./routes/domainRoutes"));
const technologyRoutes_1 = __importDefault(require("./routes/technologyRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to Database & Seed Master Data
(0, db_1.connectDB)().then(() => {
    (0, seedMasterData_1.seedDomainsAndTechnologies)();
});
// Middlewares
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Allow react dev client
    credentials: true, // Crucial to allow HttpOnly cookies cross-origin
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// API Routes
app.use("/api/v1/admin", authRoutes_1.default);
app.use("/api/v1/team", teamRoutes_1.default);
app.use("/api/v1/projects", projectRoutes_1.default);
app.use("/api/v1/applications", applicationRoutes_1.default);
app.use("/api/v1/community-settings", communitySettingsRoutes_1.default);
app.use("/api/v1/master-data", masterDataRoutes_1.default);
app.use("/api/v1/telemetry", telemetryRoutes_1.default);
app.use("/api/v1/domains", domainRoutes_1.default);
app.use("/api/v1/technologies", technologyRoutes_1.default);
// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "HiveMind Admin Authentication Server" });
});
// Run Server
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
