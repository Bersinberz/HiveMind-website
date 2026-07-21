import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import CommunitySettings from "../models/CommunitySettings";

export const getCommunitySettings = async (req: AuthRequest, res: Response) => {
    try {
        const settings = await CommunitySettings.findOne();
        return res.status(200).json({
            success: true,
            settings: settings || null
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch community settings."
        });
    }
};

/**
 * @desc    Update Community Settings
 * @route   PUT /api/v1/community-settings
 * @access  Private/Admin
 */
export const updateCommunitySettings = async (req: AuthRequest, res: Response) => {
    try {
        const {
            communityName,
            aboutCommunity,
            communityVoices,
            primaryEmail,
            contactNumber,
            tagline,
            foundedYear,
            location,
            github,
            linkedin,
            acceptingApplications
        } = req.body;

        let settings = await CommunitySettings.findOne();
        if (!settings) {
            settings = new CommunitySettings();
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
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update community settings."
        });
    }
};
