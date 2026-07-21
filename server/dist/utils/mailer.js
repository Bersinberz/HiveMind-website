"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Retrieve SMTP settings from environment or fallback
const getTransporter = async () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (host && user && pass) {
        return nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465, // true for 465, false for other ports
            auth: { user, pass }
        });
    }
    // Fallback: Create Ethereal test account for local testing
    console.log("⚠️ SMTP credentials not configured. Generating temporary Ethereal email account...");
    const testAccount = await nodemailer_1.default.createTestAccount();
    return nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};
const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = await getTransporter();
        const from = process.env.EMAIL_FROM || '"HiveMind Community" <noreply@hivemind.org>';
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html
        });
        console.log(`✉️ Email sent successfully: ${info.messageId}`);
        // If Ethereal test account was used, print the preview URL
        const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
        if (previewUrl) {
            console.log(`🔗 Ethereal Preview URL: ${previewUrl}`);
        }
        return { success: true, messageId: info.messageId, previewUrl };
    }
    catch (error) {
        console.error("❌ Email sending failed:", error);
        return { success: false, error };
    }
};
exports.sendEmail = sendEmail;
