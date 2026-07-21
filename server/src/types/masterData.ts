import { Document, Model } from "mongoose";

export interface IMasterData extends Document {
    category: "department" | "section" | "batch" | "year" | "domain" | "techstack" | "programming_language";
    value: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type MasterDataModel = Model<IMasterData>;
