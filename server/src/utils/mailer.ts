import nodemailer from "nodemailer";

// Retrieve SMTP settings from environment or fallback
const getTransporter = async () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        return nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // true for 465, false for other ports
            auth: { user, pass }
        });
    }

    // Fallback: Create Ethereal test account for local testing
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
    try {
        const transporter = await getTransporter();
        const from = process.env.EMAIL_FROM || '"HiveMind Community" <noreply@hivemind.org>';

        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html
        });


        // If Ethereal test account was used, print the preview URL
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
        }
        return { success: true, messageId: info.messageId, previewUrl };
    } catch (error) {
        return { success: false, error };
    }
};
