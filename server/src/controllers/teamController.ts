import { Request, Response } from "express";
import Team from "../models/Team";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

// GET /api/v1/team
export const getTeamMembers = async (req: Request, res: Response) => {
    try {
        const members = await Team.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, members });
    } catch (error) {
        console.error("Fetch Team Members Error: ", error);
        return res.status(500).json({ success: false, message: "Internal server error fetching team members." });
    }
};

// POST /api/v1/team
export const createTeamMember = async (req: Request, res: Response) => {
    try {
        const { fullname, email, pic, department, section, year, Linkedin, github, batch } = req.body;

        // 1. Check required fields
        if (!fullname || !email || !department || !section || !year || !batch) {
            return res.status(400).json({ success: false, message: "Full name, email, department, section, year, and batch are required." });
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
        const existingMember = await Team.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ success: false, message: "A team member with this email already exists." });
        }

        const newMember = new Team({
            fullname,
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
    } catch (error: any) {
        console.error("Create Team Member Error: ", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error creating team member." });
    }
};

// PUT /api/v1/team/:id
export const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fullname, email, pic, department, section, year, Linkedin, github, batch } = req.body;

        const member = await Team.findById(id);
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

        if (email !== undefined) {
            if (!email || !emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: "Please provide a valid email address." });
            }
            // Check uniqueness if email is changing
            if (email.toLowerCase() !== member.email.toLowerCase()) {
                const existingMember = await Team.findOne({ email });
                if (existingMember) {
                    return res.status(400).json({ success: false, message: "A team member with this email already exists." });
                }
            }
            member.email = email;
        }

        if (pic !== undefined) member.pic = pic || "";
        if (department !== undefined) {
            if (!department) return res.status(400).json({ success: false, message: "Department is required." });
            member.department = department;
        }
        if (section !== undefined) {
            if (!section) return res.status(400).json({ success: false, message: "Section is required." });
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
            if (!batch) return res.status(400).json({ success: false, message: "Batch is required." });
            member.batch = batch;
        }

        // Validate that at least one social profile is left after update
        const finalLinkedin = Linkedin !== undefined ? Linkedin : member.Linkedin;
        const finalGithub = github !== undefined ? github : member.github;
        if ((!finalLinkedin || finalLinkedin.trim() === "") && (!finalGithub || finalGithub.trim() === "")) {
            return res.status(400).json({ success: false, message: "At least one social profile (LinkedIn or GitHub) must be provided." });
        }

        await member.save();

        return res.status(200).json({
            success: true,
            message: "Team member updated successfully.",
            member
        });
    } catch (error: any) {
        console.error("Update Team Member Error: ", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error updating team member." });
    }
};

// DELETE /api/v1/team/:id
export const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Team.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Team member not found." });
        }
        return res.status(200).json({ success: true, message: "Team member deleted successfully." });
    } catch (error) {
        console.error("Delete Team Member Error: ", error);
        return res.status(500).json({ success: false, message: "Internal server error deleting team member." });
    }
};
