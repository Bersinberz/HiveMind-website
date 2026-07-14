import { Request, Response } from "express";
import NewMember from "../models/NewMember";
import { deleteFromCloudinary } from "../utils/cloudinary";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

// POST /api/v1/new-members/apply
export const applyMember = async (req: Request, res: Response) => {
    try {
        const {
            fullname,
            registerNumber,
            email,
            phoneNumber,
            dept,
            year,
            linkedin,
            github,
            resume,
            portfolio,
            domainOfInterest,
            programmingLanguages,
            whyJoin,
            hoursPerWeek,
            howDidYouHear
        } = req.body;

        // 1. Validate required fields
        if (
            !fullname ||
            !registerNumber ||
            !email ||
            !phoneNumber ||
            !dept ||
            !year ||
            !linkedin ||
            !resume ||
            !domainOfInterest ||
            !programmingLanguages ||
            !whyJoin ||
            !hoursPerWeek ||
            !howDidYouHear
        ) {
            return res.status(400).json({ success: false, message: "Please fill in all the required fields." });
        }

        // 2. Validate input constraints
        if (fullname.trim().length < 3) {
            return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address." });
        }
        if (!urlRegex.test(linkedin)) {
            return res.status(400).json({ success: false, message: "Please provide a valid LinkedIn URL." });
        }
        if (github && github.trim() !== "" && !urlRegex.test(github)) {
            return res.status(400).json({ success: false, message: "Please provide a valid GitHub URL." });
        }
        if (portfolio && portfolio.trim() !== "" && !urlRegex.test(portfolio)) {
            return res.status(400).json({ success: false, message: "Please provide a valid Portfolio URL." });
        }
        if (whyJoin.trim().length < 10) {
            return res.status(400).json({ success: false, message: "Response for 'Why do you want to join' must be at least 10 characters." });
        }

        const hours = Number(hoursPerWeek);
        if (isNaN(hours) || hours < 1) {
            return res.status(400).json({ success: false, message: "Hours you can contribute must be at least 1 hour." });
        }

        const validYears = ["1st", "2nd", "3rd", "4th"];
        if (!validYears.includes(year)) {
            return res.status(400).json({ success: false, message: "Academic year must be 1st, 2nd, 3rd, or 4th." });
        }

        // 3. Convert programming languages to array if string
        let languages: string[] = [];
        if (Array.isArray(programmingLanguages)) {
            languages = programmingLanguages.map(l => l.trim()).filter(Boolean);
        } else if (typeof programmingLanguages === "string") {
            languages = programmingLanguages.split(",").map(l => l.trim()).filter(Boolean);
        }

        if (languages.length === 0) {
            return res.status(400).json({ success: false, message: "Please specify at least one programming language." });
        }

        // 4. Verify duplicate application
        const existingApplicant = await NewMember.findOne({ email });
        if (existingApplicant) {
            return res.status(400).json({ success: false, message: "An application with this email address has already been submitted." });
        }

        // 5. Create new applicant
        const newApplicant = new NewMember({
            fullname: fullname.trim(),
            registerNumber: registerNumber.trim(),
            email: email.toLowerCase().trim(),
            phoneNumber: phoneNumber.trim(),
            dept: dept.trim(),
            year,
            linkedin: linkedin.trim(),
            github: github ? github.trim() : "",
            resume: resume.trim(),
            portfolio: portfolio ? portfolio.trim() : "",
            domainOfInterest: domainOfInterest.trim(),
            programmingLanguages: languages,
            whyJoin: whyJoin.trim(),
            hoursPerWeek: hours,
            howDidYouHear: howDidYouHear.trim(),
            status: "Pending"
        });

        await newApplicant.save();

        return res.status(201).json({
            success: true,
            message: "Your application was submitted successfully! The team will review it and reach out shortly.",
            applicant: newApplicant
        });
    } catch (error: any) {
        console.error("Apply Member Route Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error submitting application." });
    }
};

// GET /api/v1/new-members
export const getApplications = async (req: Request, res: Response) => {
    try {
        const applications = await NewMember.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, applications });
    } catch (error: any) {
        console.error("Fetch Applications Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error fetching applications." });
    }
};

// PUT /api/v1/new-members/:id/status
export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Pending", "Interviewed", "Approved", "Rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Status must be Pending, Interviewed, Approved, or Rejected." });
        }

        const application = await NewMember.findById(id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Applicant record not found." });
        }

        application.status = status;
        await application.save();

        return res.status(200).json({
            success: true,
            message: "Applicant status updated successfully.",
            application
        });
    } catch (error: any) {
        console.error("Update Status Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error updating status." });
    }
};

// DELETE /api/v1/new-members/:id
export const deleteApplication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const application = await NewMember.findById(id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Applicant record not found." });
        }

        const resumeUrl = application.resume;

        await NewMember.findByIdAndDelete(id);

        if (resumeUrl) {
            deleteFromCloudinary(resumeUrl).catch(err =>
                console.error("Error deleting applicant resume from Cloudinary:", err)
            );
        }

        return res.status(200).json({ success: true, message: "Applicant record deleted successfully." });
    } catch (error: any) {
        console.error("Delete Applicant Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error deleting applicant." });
    }
};
