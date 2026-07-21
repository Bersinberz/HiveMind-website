import { Document, Model, Types } from "mongoose";

export interface IProject extends Document {
    title: string;
    description: string;
    domain: string[];
    techStack: string[];
    domains: Types.ObjectId[];
    technologies: Types.ObjectId[];
    github: string;
    liveDemo?: string;
    thumbnail: string;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ProjectModel = Model<IProject>;
