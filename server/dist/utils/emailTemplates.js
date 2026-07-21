"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidateRejectionEmail = exports.getCandidateAcceptanceEmail = exports.getInterviewInvitationEmail = exports.getLeadsNotificationEmail = exports.getCandidateWelcomeEmail = void 0;
const getCandidateWelcomeEmail = (fullname, dept, year, registerNumber) => {
    return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 20px; margin: 0;">
    <div style="max-width: 550px; margin: 0 auto; background-color: #0c0c0e; color: #FFFFFF; border: 1px solid rgba(255, 193, 7, 0.2); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
        
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/n348amus/image/upload/v1784439510/HiveMind-Logo_qgmrdf.png" alt="HiveMind Logo" style="width: 60px; height: auto; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #FFC107; font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                HIVEMIND
            </h2>
        </div>

        <!-- Body -->
        <div style="color: #DDDDDD; font-size: 14px; line-height: 1.6;">
            <p style="font-size: 16px; color: #FFFFFF; font-weight: 600; margin-bottom: 20px;">Hello ${fullname},</p>
            <p style="margin-bottom: 25px;">
                Thank you for applying to the <strong>HiveMind community</strong>. We have successfully received your profile. Our committee is currently reviewing applications and will reach out to you shortly regarding the next steps.
            </p>

            <!-- Application Summary -->
            <div style="background-color: rgba(255, 255, 255, 0.03); border-radius: 10px; padding: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #FFC107; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                    Application Overview
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                        <td style="padding: 8px 0; color: #888888; width: 45%;">REGISTER NUMBER</td>
                        <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600; text-align: right; font-family: monospace;">${registerNumber}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                        <td style="padding: 8px 0; color: #888888;">DEPARTMENT</td>
                        <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600; text-align: right;">${dept}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #888888;">YEAR OF STUDY</td>
                        <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600; text-align: right;">${year}</td>
                    </tr>
                </table>
            </div>

            <p style="margin-top: 25px; margin-bottom: 0;">
                Best regards,<br />
                <strong style="color: #FFC107;">The Core Team</strong><br />
                HiveMind Community
            </p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; text-align: center; color: #555555; font-size: 9px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px;">
            This is an automated notification. Please do not reply to this email.
        </div>
    </div>
</div>
    `;
};
exports.getCandidateWelcomeEmail = getCandidateWelcomeEmail;
const getLeadsNotificationEmail = (fullname, registerNumber, email, phoneNumber, dept, year, domains, languages, whyJoin, howDidYouHear, resume, linkedin, github, portfolio) => {
    return `
    <div style="font-family: Arial, sans-serif; padding: 40px 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0c0c0e; color: #FFFFFF; border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 20px; padding: 32px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.65);">
            <!-- Header -->
            <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px; margin-bottom: 24px; text-align: left;">
                <h2 style="margin: 0; color: #FFC107; font-size: 18px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                    New Member Application
                </h2>
                <span style="color: #888888; font-size: 9px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; display: block; margin-top: 2px;">
                    HiveMind Supercomputing Lab
                </span>
            </div>

            <!-- Body -->
            <div style="color: #DDDDDD; font-size: 13px; line-height: 1.6; text-align: left;">
                <p style="font-size: 14px; color: #FFFFFF; font-weight: bold; margin-bottom: 16px;">
                    A new candidate profile has been submitted for recruitment review.
                </p>

                <!-- Candidate Details Table -->
                <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; margin-bottom: 14px; color: #FFC107; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px;">
                        Candidate Details
                    </h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <tr>
                            <td style="padding: 6px 0; color: #888888; width: 140px; font-weight: bold; text-transform: uppercase; font-size: 10px;">Full Name</td>
                            <td style="padding: 6px 0; color: #FFFFFF; font-weight: bold;">${fullname}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 10px;">Register No</td>
                            <td style="padding: 6px 0; color: #FFFFFF; font-weight: 500;">${registerNumber}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 10px;">Email</td>
                            <td style="padding: 6px 0; color: #FFFFFF; font-weight: 500;"><a href="mailto:${email}" style="color: #FFC107; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 10px;">Phone</td>
                            <td style="padding: 6px 0; color: #FFFFFF; font-weight: 500;">+91 ${phoneNumber}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 10px;">Dept & Year</td>
                            <td style="padding: 6px 0; color: #FFFFFF; font-weight: 500;">${dept} — ${year} Year</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 10px;">Domains</td>
                            <td style="padding: 6px 0; color: #FFC107; font-weight: bold;">${domains}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 10px;">Languages</td>
                            <td style="padding: 6px 0; color: #FFFFFF; font-family: monospace;">${languages}</td>
                        </tr>
                    </table>
                </div>

                <!-- Personal Statement -->
                <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; margin-bottom: 10px; color: #FFC107; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px;">
                        Why want to join HiveMind?
                    </h3>
                    <p style="margin: 0; font-size: 12px; color: #CCCCCC; white-space: pre-line; line-height: 1.5;">${whyJoin}</p>
                </div>

                <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <h3 style="margin-top: 0; margin-bottom: 10px; color: #FFC107; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px;">
                        Referral Source
                    </h3>
                    <p style="margin: 0; font-size: 12px; color: #CCCCCC;">${howDidYouHear}</p>
                </div>

                <!-- Profiles & Attachments Links -->
                <div style="margin-bottom: 24px; text-align: center;">
                    <a href="${resume}" target="_blank" style="background-color: #FFC107; color: #050505; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 12px; text-transform: uppercase; display: inline-block; margin: 4px;">
                        View Resume PDF
                    </a>
                    <a href="${linkedin}" target="_blank" style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 12px; text-transform: uppercase; display: inline-block; margin: 4px;">
                        LinkedIn
                    </a>
                    ${github ? `
                    <a href="${github}" target="_blank" style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 12px; text-transform: uppercase; display: inline-block; margin: 4px;">
                        GitHub
                    </a>
                    ` : ""}
                    ${portfolio ? `
                    <a href="${portfolio}" target="_blank" style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 12px; text-transform: uppercase; display: inline-block; margin: 4px;">
                        Portfolio
                    </a>
                    ` : ""}
                </div>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px; margin-top: 30px; text-align: center; color: #666666; font-size: 10px;">
                Please access the Admin Panel to manage this application.
            </div>
        </div>
    </div>
    `;
};
exports.getLeadsNotificationEmail = getLeadsNotificationEmail;
const getInterviewInvitationEmail = (fullname, date, time) => {
    // Format date nicely (e.g. 2026-07-25 to 25 July 2026 if valid, or keep as is)
    let formattedDate = date;
    try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString("en-US", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }
    catch (e) { }
    return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 20px; margin: 0;">
    <div style="max-width: 550px; margin: 0 auto; background-color: #0c0c0e; color: #FFFFFF; border: 1px solid rgba(255, 193, 7, 0.2); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
        
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/n348amus/image/upload/v1784439510/HiveMind-Logo_qgmrdf.png" alt="HiveMind Logo" style="width: 60px; height: auto; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #FFC107; font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                HIVEMIND
            </h2>
        </div>

        <!-- Body -->
        <div style="color: #DDDDDD; font-size: 14px; line-height: 1.6;">
            <p style="font-size: 16px; color: #FFFFFF; font-weight: 600; margin-bottom: 20px;">Hello ${fullname},</p>
            <p style="margin-bottom: 25px;">
                Congratulations! We have reviewed your application and would like to invite you for a <strong>Technical Interview & Discussion</strong> at the <strong>Supercomputing Lab</strong>.
            </p>

            <!-- Schedule Card -->
            <div style="background-color: rgba(255, 193, 7, 0.03); border: 1px solid rgba(255, 193, 7, 0.2); border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 15px 0; color: #FFC107; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                    Technical Discussion Schedule
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                        <td style="padding: 8px 0; color: #888888; width: 35%;">DATE</td>
                        <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600; text-align: right;">${formattedDate}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                        <td style="padding: 8px 0; color: #888888;">TIME</td>
                        <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600; text-align: right;">${time}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #888888;">LOCATION</td>
                        <td style="padding: 8px 0; color: #FFC107; font-weight: 600; text-align: right;">Supercomputing Lab</td>
                    </tr>
                </table>
            </div>

            <p style="margin-bottom: 25px;">
                Please ensure you bring your laptop and are prepared to discuss your projects, programming background, and interest in domains like Artificial Intelligence and High Performance Computing.
            </p>

            <p style="margin-top: 25px; margin-bottom: 0;">
                Best regards,<br />
                <strong style="color: #FFC107;">The Core Team</strong><br />
                HiveMind Community
            </p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; text-align: center; color: #555555; font-size: 9px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px;">
            This is an automated notification. Please do not reply to this email.
        </div>
    </div>
</div>
    `;
};
exports.getInterviewInvitationEmail = getInterviewInvitationEmail;
const getCandidateAcceptanceEmail = (fullname) => {
    return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 20px; margin: 0;">
    <div style="max-width: 550px; margin: 0 auto; background-color: #0c0c0e; color: #FFFFFF; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
        
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/n348amus/image/upload/v1784439510/HiveMind-Logo_qgmrdf.png" alt="HiveMind Logo" style="width: 60px; height: auto; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #10B981; font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                WELCOME TO HIVEMIND
            </h2>
        </div>

        <!-- Body -->
        <div style="color: #DDDDDD; font-size: 14px; line-height: 1.6;">
            <p style="font-size: 16px; color: #FFFFFF; font-weight: 600; margin-bottom: 20px;">Hello ${fullname},</p>
            <p style="margin-bottom: 20px;">
                We are absolutely thrilled to inform you that you have been **accepted** into the **HiveMind Community**! 🎉
            </p>
            <p style="margin-bottom: 25px;">
                Your performance in the interview and application impressed our core team. We are excited to see you collaborate, build, and push the boundaries of AI, High Performance Computing, and software development with us.
            </p>

            <div style="background-color: rgba(16, 185, 129, 0.03); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 10px; padding: 20px; margin-bottom: 25px; text-align: center;">
                <p style="margin: 0; color: #10B981; font-weight: bold; font-size: 13px;">
                    Next Steps
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #AAAAAA;">
                    We will send details regarding onboarding meetings and community workspace invites shortly. Stay tuned to your email!
                </p>
            </div>

            <p style="margin-top: 25px; margin-bottom: 0;">
                Welcome to the family,<br />
                <strong style="color: #FFC107;">The Core Team</strong><br />
                HiveMind Community
            </p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; text-align: center; color: #555555; font-size: 9px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px;">
            This is an automated notification. Please do not reply to this email.
        </div>
    </div>
</div>
    `;
};
exports.getCandidateAcceptanceEmail = getCandidateAcceptanceEmail;
const getCandidateRejectionEmail = (fullname) => {
    return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 20px; margin: 0;">
    <div style="max-width: 550px; margin: 0 auto; background-color: #0c0c0e; color: #FFFFFF; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
        
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/n348amus/image/upload/v1784439510/HiveMind-Logo_qgmrdf.png" alt="HiveMind Logo" style="width: 60px; height: auto; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #EF4444; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                HIVEMIND RECRUITMENT
            </h2>
        </div>

        <!-- Body -->
        <div style="color: #DDDDDD; font-size: 14px; line-height: 1.6;">
            <p style="font-size: 16px; color: #FFFFFF; font-weight: 600; margin-bottom: 20px;">Hello ${fullname},</p>
            <p style="margin-bottom: 20px;">
                Thank you for taking the time to apply to HiveMind and discussing your profile and interests with us.
            </p>
            <p style="margin-bottom: 25px;">
                We received a large number of outstanding applications this semester. While we were impressed by your background, we regret to inform you that we are unable to offer you a position in the community at this time.
            </p>
            <p style="margin-bottom: 25px;">
                We encourage you to continue building, sharpening your skills, and apply again in future recruitment drives.
            </p>

            <p style="margin-top: 25px; margin-bottom: 0;">
                Best regards,<br />
                <strong style="color: #FFC107;">The Core Team</strong><br />
                HiveMind Community
            </p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; text-align: center; color: #555555; font-size: 9px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px;">
            This is an automated notification. Please do not reply to this email.
        </div>
    </div>
</div>
    `;
};
exports.getCandidateRejectionEmail = getCandidateRejectionEmail;
