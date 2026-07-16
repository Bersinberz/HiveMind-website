import { Document, Model } from "mongoose";

export interface IMasterData extends Document {
    category: "department" | "section" | "batch" | "year" | "domain" | "techstack";
    value: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type MasterDataModel = Model<IMasterData>;
