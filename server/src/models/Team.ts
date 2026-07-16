import { Schema, model } from "mongoose";
import { ITeam, TeamModel } from "../types/team";

const teamSchema = new Schema<ITeam, TeamModel>(
    {
        fullname: {
            type: String,
            required: [true, "Full name is required"],
            minlength: [3, "Full name must be at least 3 characters"],
            trim: true,
        },
        registerNumber: {
            type: String,
            required: [true, "Register number is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
        },
        pic: {
            type: String,
            trim: true,
            default: "",
        },
        department: {
            type: String,
            required: [true, "Department is required"],
            trim: true,
        },
        section: {
            type: String,
            required: [true, "Section is required"],
            trim: true,
        },
        year: {
            type: String,
            required: [true, "Year is required"],
            enum: {
                values: ["1st", "2nd", "3rd", "4th"],
                message: "Year must be either 1st, 2nd, 3rd, or 4th",
            },
        },
        Linkedin: {
            type: String,
            trim: true,
            default: "",
        },
        github: {
            type: String,
            trim: true,
            default: "",
        },
        batch: {
            type: String,
            required: [true, "Batch is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Team = model<ITeam, TeamModel>("Team", teamSchema);
export default Team;
