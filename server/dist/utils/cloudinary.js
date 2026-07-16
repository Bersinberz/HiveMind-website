"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.getPublicIdFromUrl = void 0;
const crypto_1 = __importDefault(require("crypto"));
const getPublicIdFromUrl = (url) => {
    try {
        if (!url || !url.includes("res.cloudinary.com"))
            return null;
        const parts = url.split("/image/upload/");
        if (parts.length < 2)
            return null;
        let publicIdWithPath = parts[1];
        const match = publicIdWithPath.match(/^v\d+\/(.+)$/);
        if (match) {
            publicIdWithPath = match[1];
        }
        const dotIndex = publicIdWithPath.lastIndexOf(".");
        if (dotIndex !== -1) {
            publicIdWithPath = publicIdWithPath.substring(0, dotIndex);
        }
        return decodeURIComponent(publicIdWithPath);
    }
    catch (e) {
        console.error("Error parsing Cloudinary URL:", e);
        return null;
    }
};
exports.getPublicIdFromUrl = getPublicIdFromUrl;
const deleteFromCloudinary = async (url) => {
    const publicId = (0, exports.getPublicIdFromUrl)(url);
    if (!publicId)
        return false;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "n348amus";
    const apiKey = process.env.CLOUDINARY_API_KEY || "988395172976455";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "XC2rrzLs0uU4H8i7A3GD_JnHzvY";
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto_1.default.createHash("sha1").update(signatureString).digest("hex");
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                public_id: publicId,
                timestamp: timestamp.toString(),
                api_key: apiKey,
                signature: signature,
            }),
        });
        const data = await response.json();
        if (data && data.result === "ok") {
            console.log(`Successfully deleted image from Cloudinary: ${publicId}`);
            return true;
        }
        else {
            console.warn(`Failed to delete image from Cloudinary: ${publicId}. Response:`, data);
            return false;
        }
    }
    catch (error) {
        console.error(`Error deleting image from Cloudinary for publicId ${publicId}:`, error.message || error);
        return false;
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
