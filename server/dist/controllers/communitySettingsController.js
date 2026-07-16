"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommunitySettings = exports.getCommunitySettings = void 0;
const CommunitySettings_1 = __importDefault(require("../models/CommunitySettings"));
// Default seed values for Community Settings
const DEFAULT_SETTINGS = {
    communityName: "HiveMind",
    aboutCommunity: "HiveMind is a student-driven Artificial Intelligence community at Sathyabama Institute of Science and Technology, operating from the AI Supercomputing Laboratory in the SCAS Block. We bring together passionate students who share a common vision of exploring, building, and advancing AI through hands-on learning, research, and innovation. Our members work on cutting-edge technologies such as Generative AI, Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Transformers, Computer Vision, Deep Learning, AI Agents, MLOps, and cloud-based AI solutions, transforming ideas into impactful real-world applications. Guided by experienced faculty mentors, HiveMind fosters a collaborative environment where curiosity meets engineering, empowering students to contribute to open-source projects, participate in hackathons, conduct research, and develop intelligent systems that shape the future of technology.",
    primaryEmail: "contact@hivemind.org",
    contactNumber: "+91-1234567890",
    tagline: "Fostering student innovation through artificial intelligence.",
    foundedYear: "2023",
    location: "SCAS Block, Sathyabama Institute of Science and Technology",
    github: "https://github.com/hivemind",
    linkedin: "https://linkedin.com/company/hivemind",
    acceptingApplications: true,
    communityVoices: [
        {
            name: "Rahul S.",
            whoIsHe: "AI Research Lead",
            description: "Being part of HiveMind changed my perspective on engineering. Working in the AI Supercomputing Lab gave me access to state-of-the-art GPU nodes and collaboration that you can't find in a standard classroom.",
            pic: ""
        },
        {
            name: "Dr. Anitha P.",
            whoIsHe: "Faculty Mentor",
            description: "HiveMind represents the peak of student innovation at Sathyabama. The projects developed here show that with the right mentorship and computing power, students can tackle complex, real-world problems.",
            pic: ""
        },
        {
            name: "Priya K.",
            whoIsHe: "Alumni / ML Engineer",
            description: "The hands-on experience in MLOps pipelines and large language model architectures I gained at HiveMind was the primary reason I landed my job as an ML Engineer right after graduation.",
            pic: ""
        }
    ]
};
/**
 * @desc    Get Community Settings
 * @route   GET /api/v1/community-settings
 * @access  Public
 */
const getCommunitySettings = async (req, res) => {
    try {
        let settings = await CommunitySettings_1.default.findOne();
        if (!settings) {
            // Seed settings if they don't exist yet
            settings = await CommunitySettings_1.default.create(DEFAULT_SETTINGS);
        }
        return res.status(200).json({
            success: true,
            settings
        });
    }
    catch (error) {
        console.error("Get Community Settings Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch community settings."
        });
    }
};
exports.getCommunitySettings = getCommunitySettings;
/**
 * @desc    Update Community Settings
 * @route   PUT /api/v1/community-settings
 * @access  Private/Admin
 */
const updateCommunitySettings = async (req, res) => {
    try {
        const { communityName, aboutCommunity, communityVoices, primaryEmail, contactNumber, tagline, foundedYear, location, github, linkedin, acceptingApplications } = req.body;
        let settings = await CommunitySettings_1.default.findOne();
        if (!settings) {
            settings = new CommunitySettings_1.default();
        }
        settings.communityName = communityName !== undefined ? communityName : settings.communityName;
        settings.aboutCommunity = aboutCommunity !== undefined ? aboutCommunity : settings.aboutCommunity;
        settings.primaryEmail = primaryEmail !== undefined ? primaryEmail : settings.primaryEmail;
        settings.contactNumber = contactNumber !== undefined ? contactNumber : settings.contactNumber;
        settings.tagline = tagline !== undefined ? tagline : settings.tagline;
        settings.foundedYear = foundedYear !== undefined ? foundedYear : settings.foundedYear;
        settings.location = location !== undefined ? location : settings.location;
        settings.github = github !== undefined ? github : settings.github;
        settings.linkedin = linkedin !== undefined ? linkedin : settings.linkedin;
        settings.acceptingApplications = acceptingApplications !== undefined ? acceptingApplications : settings.acceptingApplications;
        if (communityVoices) {
            settings.communityVoices = communityVoices;
        }
        await settings.save();
        return res.status(200).json({
            success: true,
            message: "Community settings updated successfully.",
            settings
        });
    }
    catch (error) {
        console.error("Update Community Settings Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update community settings."
        });
    }
};
exports.updateCommunitySettings = updateCommunitySettings;
