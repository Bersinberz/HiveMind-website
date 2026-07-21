"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommunitySettings = exports.getCommunitySettings = void 0;
const CommunitySettings_1 = __importDefault(require("../models/CommunitySettings"));
const getCommunitySettings = async (req, res) => {
    try {
        const settings = await CommunitySettings_1.default.findOne();
        return res.status(200).json({
            success: true,
            settings: settings || null
        });
    }
    catch (error) {
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
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update community settings."
        });
    }
};
exports.updateCommunitySettings = updateCommunitySettings;
