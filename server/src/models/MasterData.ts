import { Schema, model } from "mongoose";
import { IMasterData, MasterDataModel } from "../types/masterData";

const masterDataSchema = new Schema<IMasterData, MasterDataModel>(
    {
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["department", "section", "batch", "year", "domain", "techstack"],
                message: "Category must be department, section, batch, year, domain, or techstack"
            }
        },
        value: {
            type: String,
            required: [true, "Value is required"],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Compound index to guarantee uniqueness of value within a specific category
masterDataSchema.index({ category: 1, value: 1 }, { unique: true });

export const MasterData = model<IMasterData, MasterDataModel>("MasterData", masterDataSchema);
export default MasterData;
