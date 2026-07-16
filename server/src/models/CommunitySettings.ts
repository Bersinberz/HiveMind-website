import { Schema, model } from "mongoose";
import { ICommunitySettings, CommunitySettingsModel, ITestimonial } from "../types/communitySettings";

const testimonialSchema = new Schema<ITestimonial>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        whoIsHe: {
            type: String,
            required: [true, "Role/Designation is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        pic: {
            type: String,
            trim: true,
            default: "",
        },
    }
);

const communitySettingsSchema = new Schema<ICommunitySettings, CommunitySettingsModel>(
    {
        communityName: {
            type: String,
            required: [true, "Community Name is required"],
            trim: true,
            default: "HiveMind",
        },
        aboutCommunity: {
            type: String,
            required: [true, "About Community description is required"],
            trim: true,
        },
        primaryEmail: {
            type: String,
            trim: true,
            default: "",
        },
        contactNumber: {
            type: String,
            trim: true,
            default: "",
        },
        tagline: {
            type: String,
            trim: true,
            default: "",
        },
        foundedYear: {
            type: String,
            trim: true,
            default: "",
        },
        location: {
            type: String,
            trim: true,
            default: "",
        },
        github: {
            type: String,
            trim: true,
            default: "",
        },
        linkedin: {
            type: String,
            trim: true,
            default: "",
        },
        acceptingApplications: {
            type: Boolean,
            default: true,
        },
        communityVoices: [testimonialSchema],
    },
    {
        timestamps: true,
    }
);

export const CommunitySettings = model<ICommunitySettings, CommunitySettingsModel>(
    "CommunitySettings",
    communitySettingsSchema
);

export default CommunitySettings;
