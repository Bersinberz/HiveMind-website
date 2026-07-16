import { Document, Model } from "mongoose";

export interface ITeam extends Document {
    fullname: string;
    registerNumber: string;
    email: string;
    pic?: string;
    department: string;
    section: string;
    year: "1st" | "2nd" | "3rd" | "4th";
    Linkedin?: string;
    github?: string;
    batch: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TeamModel = Model<ITeam>;
