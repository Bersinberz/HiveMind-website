import { Document, Model } from "mongoose";

export interface ITestimonial {
    name: string;
    whoIsHe: string;
    description: string;
    pic?: string;
}

export interface ICommunitySettings extends Document {
    communityName: string;
    aboutCommunity: string;
    primaryEmail: string;
    contactNumber: string;
    tagline: string;
    foundedYear: string;
    location: string;
    github: string;
    linkedin: string;
    acceptingApplications: boolean;
    communityVoices: ITestimonial[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type CommunitySettingsModel = Model<ICommunitySettings>;
