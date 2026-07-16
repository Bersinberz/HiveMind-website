"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamMember = exports.updateTeamMember = exports.createTeamMember = exports.getTeamMembers = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const cloudinary_1 = require("../utils/cloudinary");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
// GET /api/v1/team
const getTeamMembers = async (req, res) => {
    try {
        const members = await Team_1.default.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, members });
    }
    catch (error) {
        console.error("Fetch Team Members Error: ", error);
        return res.status(500).json({ success: false, message: "Internal server error fetching team members." });
    }
};
exports.getTeamMembers = getTeamMembers;
// POST /api/v1/team
const createTeamMember = async (req, res) => {
    try {
        const { fullname, registerNumber, email, pic, department, section, year, Linkedin, github, batch } = req.body;
        // 1. Check required fields
        if (!fullname || !registerNumber || !email || !department || !section || !year || !batch) {
            return res.status(400).json({ success: false, message: "Full name, register number, email, department, section, year, and batch are required." });
        }
        // 2. Validate length
        if (fullname.trim().length < 3) {
            return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
        }
        // 3. Validate email structure
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }
        // 4. Validate year enum
        const validYears = ["1st", "2nd", "3rd", "4th"];
        if (!validYears.includes(year)) {
            return res.status(400).json({ success: false, message: "Year must be 1st, 2nd, 3rd, or 4th." });
        }
        // 5. Validate URLs if provided
        if (Linkedin && Linkedin.trim() !== "" && !urlRegex.test(Linkedin)) {
            return res.status(400).json({ success: false, message: "Please provide a valid LinkedIn URL." });
        }
        if (github && github.trim() !== "" && !urlRegex.test(github)) {
            return res.status(400).json({ success: false, message: "Please provide a valid GitHub URL." });
        }
        // 5b. Enforce at least one social link
        if ((!Linkedin || Linkedin.trim() === "") && (!github || github.trim() === "")) {
            return res.status(400).json({ success: false, message: "At least one social profile (LinkedIn or GitHub) must be provided." });
        }
        // 6. Check unique email in DB
        const existingMember = await Team_1.default.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ success: false, message: "A team member with this email already exists." });
        }
        const newMember = new Team_1.default({
            fullname,
            registerNumber,
            email,
            pic: pic || "",
            department,
            section,
            year,
            Linkedin: Linkedin || "",
            github: github || "",
            batch,
        });
        await newMember.save();
        return res.status(201).json({
            success: true,
            message: "Team member created successfully.",
            member: newMember
        });
    }
    catch (error) {
        console.error("Create Team Member Error: ", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error creating team member." });
    }
};
exports.createTeamMember = createTeamMember;
// PUT /api/v1/team/:id
const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, registerNumber, email, pic, department, section, year, Linkedin, github, batch } = req.body;
        const member = await Team_1.default.findById(id);
        if (!member) {
            return res.status(404).json({ success: false, message: "Team member not found." });
        }
        // Validate body if fields are changing
        if (fullname !== undefined) {
            if (!fullname || fullname.trim().length < 3) {
                return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
            }
            member.fullname = fullname;
        }
        if (registerNumber !== undefined) {
            if (!registerNumber)
                return res.status(400).json({ success: false, message: "Register number is required." });
            member.registerNumber = registerNumber;
        }
        if (email !== undefined) {
            if (!email || !emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: "Please provide a valid email address." });
            }
            // Check uniqueness if email is changing
            if (email.toLowerCase() !== member.email.toLowerCase()) {
                const existingMember = await Team_1.default.findOne({ email });
                if (existingMember) {
                    return res.status(400).json({ success: false, message: "A team member with this email already exists." });
                }
            }
            member.email = email;
        }
        let oldPicUrl = "";
        if (pic !== undefined) {
            if (pic !== member.pic && member.pic) {
                oldPicUrl = member.pic;
            }
            member.pic = pic || "";
        }
        if (department !== undefined) {
            if (!department)
                return res.status(400).json({ success: false, message: "Department is required." });
            member.department = department;
        }
        if (section !== undefined) {
            if (!section)
                return res.status(400).json({ success: false, message: "Section is required." });
            member.section = section;
        }
        if (year !== undefined) {
            const validYears = ["1st", "2nd", "3rd", "4th"];
            if (!validYears.includes(year)) {
                return res.status(400).json({ success: false, message: "Year must be 1st, 2nd, 3rd, or 4th." });
            }
            member.year = year;
        }
        if (Linkedin !== undefined) {
            if (Linkedin && Linkedin.trim() !== "" && !urlRegex.test(Linkedin)) {
                return res.status(400).json({ success: false, message: "Please provide a valid LinkedIn URL." });
            }
            member.Linkedin = Linkedin || "";
        }
        if (github !== undefined) {
            if (github && github.trim() !== "" && !urlRegex.test(github)) {
                return res.status(400).json({ success: false, message: "Please provide a valid GitHub URL." });
            }
            member.github = github || "";
        }
        if (batch !== undefined) {
            if (!batch)
                return res.status(400).json({ success: false, message: "Batch is required." });
            member.batch = batch;
        }
        // Validate that at least one social profile is left after update
        const finalLinkedin = Linkedin !== undefined ? Linkedin : member.Linkedin;
        const finalGithub = github !== undefined ? github : member.github;
        if ((!finalLinkedin || finalLinkedin.trim() === "") && (!finalGithub || finalGithub.trim() === "")) {
            return res.status(400).json({ success: false, message: "At least one social profile (LinkedIn or GitHub) must be provided." });
        }
        await member.save();
        if (oldPicUrl) {
            (0, cloudinary_1.deleteFromCloudinary)(oldPicUrl).catch(err => console.error("Error deleting old profile photo from Cloudinary:", err));
        }
        return res.status(200).json({
            success: true,
            message: "Team member updated successfully.",
            member
        });
    }
    catch (error) {
        console.error("Update Team Member Error: ", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error updating team member." });
    }
};
exports.updateTeamMember = updateTeamMember;
// DELETE /api/v1/team/:id
const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Team_1.default.findById(id);
        if (!member) {
            return res.status(404).json({ success: false, message: "Team member not found." });
        }
        const picUrl = member.pic;
        await Team_1.default.findByIdAndDelete(id);
        if (picUrl) {
            (0, cloudinary_1.deleteFromCloudinary)(picUrl).catch(err => console.error("Error deleting profile photo from Cloudinary:", err));
        }
        return res.status(200).json({ success: true, message: "Team member deleted successfully." });
    }
    catch (error) {
        console.error("Delete Team Member Error: ", error);
        return res.status(500).json({ success: false, message: "Internal server error deleting team member." });
    }
};
exports.deleteTeamMember = deleteTeamMember;
