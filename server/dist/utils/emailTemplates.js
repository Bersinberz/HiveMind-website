"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidateRejectionEmail = exports.getCandidateAcceptanceEmail = exports.getInterviewInvitationEmail = exports.getLeadsNotificationEmail = exports.getCandidateWelcomeEmail = void 0;
const getRecruitmentProgressHtml = (stage) => {
    const activeColor = "#FFC107";
    const inactiveColor = "rgba(255, 255, 255, 0.1)";
    const activeTextColor = "#FFC107";
    const inactiveTextColor = "#888888";
    return `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 25px auto; max-width: 400px; font-family: 'Segoe UI', Arial, sans-serif; text-align: center;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                        <!-- Step 1 Dot -->
                        <td align="center" width="12" style="vertical-align: middle;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${stage >= 1 ? activeColor : inactiveColor}; line-height: 12px; font-size: 1px;">&nbsp;</div>
                        </td>
                        <!-- Connector line 1 -->
                        <td align="center" style="vertical-align: middle; padding: 0 4px;">
                            <div style="height: 1px; width: 100%; min-width: 50px; background-color: ${stage >= 2 ? activeColor : inactiveColor}; line-height: 1px; font-size: 1px;">&nbsp;</div>
                        </td>
                        <!-- Step 2 Dot -->
                        <td align="center" width="12" style="vertical-align: middle;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${stage >= 2 ? activeColor : inactiveColor}; line-height: 12px; font-size: 1px;">&nbsp;</div>
                        </td>
                        <!-- Connector line 2 -->
                        <td align="center" style="vertical-align: middle; padding: 0 4px;">
                            <div style="height: 1px; width: 100%; min-width: 50px; background-color: ${stage >= 3 ? activeColor : inactiveColor}; line-height: 1px; font-size: 1px;">&nbsp;</div>
                        </td>
                        <!-- Step 3 Dot -->
                        <td align="center" width="12" style="vertical-align: middle;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${stage >= 3 ? activeColor : inactiveColor}; line-height: 12px; font-size: 1px;">&nbsp;</div>
                        </td>
                    </tr>
                    <tr style="font-size: 9px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; font-family: 'Segoe UI', Arial, sans-serif;">
                        <!-- Step 1 Label -->
                        <td align="center" style="padding-top: 8px; color: ${stage >= 1 ? activeTextColor : inactiveTextColor}; font-family: 'Segoe UI', Arial, sans-serif; width: 60px;">
                            Application
                        </td>
                        <td style="padding-top: 8px;">&nbsp;</td>
                        <!-- Step 2 Label -->
                        <td align="center" style="padding-top: 8px; color: ${stage >= 2 ? activeTextColor : inactiveTextColor}; font-family: 'Segoe UI', Arial, sans-serif; width: 60px;">
                            Review
                        </td>
                        <td style="padding-top: 8px;">&nbsp;</td>
                        <!-- Step 3 Label -->
                        <td align="center" style="padding-top: 8px; color: ${stage >= 3 ? activeTextColor : inactiveTextColor}; font-family: 'Segoe UI', Arial, sans-serif; width: 60px; white-space: nowrap;">
                            Technical Interview
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    `;
};
const getCandidateEmailLayout = (title, statusLabel, progressStage, fullname, paragraphs, customCardHtml = "", specialBannerHtml = "", statusColorOptions = { border: "rgba(255, 193, 7, 0.2)", bg: "rgba(255, 193, 7, 0.03)", text: "#FFC107" }) => {
    const formattedParagraphs = paragraphs
        .map(p => `<p style="margin-bottom: 20px;">${p}</p>`)
        .join("");
    return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px 10px; margin: 0;">
    <div style="max-width: 550px; margin: 0 auto; background-color: #0c0c0e; color: #FFFFFF; border: 1px solid rgba(255, 193, 7, 0.2); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
        
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 20px;">
            <img src="https://res.cloudinary.com/n348amus/image/upload/v1784439510/HiveMind-Logo_qgmrdf.png" alt="HiveMind Logo" style="width: 50px; height: auto; margin-bottom: 10px;">
            <h2 style="margin: 0; color: #FFC107; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                HIVEMIND
            </h2>
        </div>

        <!-- Status Label -->
        <div style="text-align: center; margin-bottom: 20px;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; border: 1px solid ${statusColorOptions.border}; background-color: ${statusColorOptions.bg}; color: ${statusColorOptions.text}; font-family: 'Segoe UI', Arial, sans-serif;">
                ${statusLabel}
            </span>
        </div>

        <!-- Main Email Heading -->
        <h1 style="text-align: center; margin: 0 0 20px 0; font-size: 22px; font-weight: 800; color: #FFFFFF; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: -0.5px;">
            ${title}
        </h1>

        <!-- Recruitment Progress Indicator -->
        ${getRecruitmentProgressHtml(progressStage)}

        <!-- Special Banner if Selected/Accepted -->
        ${specialBannerHtml}

        <!-- Personalized Greeting & Body -->
        <div style="color: #DDDDDD; font-size: 14px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif;">
            <p style="font-size: 15px; color: #FFFFFF; font-weight: 600; margin-bottom: 20px;">Dear ${fullname},</p>
            
            ${formattedParagraphs}

            <!-- Dynamic Content Card -->
            ${customCardHtml}

            <!-- Regards & Sign-off -->
            <p style="margin-top: 30px; margin-bottom: 0; color: #DDDDDD;">
                Regards,<br />
                <strong style="color: #FFC107; font-weight: 700;">HiveMind Team</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; text-align: center; color: #555555; font-size: 9px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5;">
            <div style="font-weight: 800; letter-spacing: 1px; color: #FFC107; margin-bottom: 5px; font-size: 10px;">HIVEMIND</div>
            <div style="margin-bottom: 3px;">This is an automated notification from the HiveMind recruitment system.</div>
            <div style="margin-bottom: 5px;">Please do not reply to this email.</div>
            <div style="color: #444444;">&copy; 2026 HiveMind</div>
        </div>
    </div>
</div>
    `;
};
const getCandidateWelcomeEmail = (fullname, dept, year, registerNumber) => {
    const paragraphs = [
        "Thank you for your interest in joining HiveMind.",
        "We have successfully received your application. Our team will review your profile, interests, and the information you have provided as part of our selection process.",
        "If your application is shortlisted, you will receive further information regarding the Technical Interview through your registered email address.",
        "We appreciate the time and effort you have taken to apply and wish you the very best throughout the selection process."
    ];
    const cardHtml = `
    <!-- Application Overview Card -->
    <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 20px; margin-top: 25px;">
        <h3 style="margin: 0 0 15px 0; color: #FFC107; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
            Application Overview
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: 'Segoe UI', Arial, sans-serif;">
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 8px 0; color: #888888; width: 45%; font-weight: 600; text-transform: uppercase; font-size: 10px;">Register Number</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-weight: 700; text-align: right; font-family: monospace;">${registerNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 8px 0; color: #888888; font-weight: 600; text-transform: uppercase; font-size: 10px;">Department</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-weight: 700; text-align: right;">${dept}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #888888; font-weight: 600; text-transform: uppercase; font-size: 10px;">Year of Study</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-weight: 700; text-align: right;">${year}</td>
            </tr>
        </table>
    </div>
    `;
    return getCandidateEmailLayout("Application Received", "APPLICATION SUBMITTED", 1, fullname, paragraphs, cardHtml);
};
exports.getCandidateWelcomeEmail = getCandidateWelcomeEmail;
const getLeadsNotificationEmail = (fullname, registerNumber, email, phoneNumber, dept, year, domains, languages, whyJoin, howDidYouHear, resume, linkedin, github, portfolio) => {
    const escapeHtml = (text) => {
        if (!text)
            return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    const escapedName = escapeHtml(fullname);
    const escapedReg = escapeHtml(registerNumber);
    const escapedEmail = escapeHtml(email);
    const escapedPhone = escapeHtml(phoneNumber);
    const escapedDept = escapeHtml(dept);
    const escapedYear = escapeHtml(year);
    const escapedDomains = escapeHtml(domains);
    const escapedLanguages = escapeHtml(languages);
    const escapedWhyJoin = escapeHtml(whyJoin);
    const escapedHowHear = escapeHtml(howDidYouHear);
    return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px 10px; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #0c0c0e; color: #FFFFFF; border: 1px solid rgba(255, 193, 7, 0.25); border-radius: 16px; padding: 32px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.65);">
        
        <!-- Header with Logo -->
        <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 20px; margin-bottom: 24px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                    <td align="left" style="vertical-align: middle;">
                        <h2 style="margin: 0; color: #FFC107; font-size: 18px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                            New Membership Application
                        </h2>
                        <span style="color: #888888; font-size: 9px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; display: block; margin-top: 4px;">
                            HiveMind Supercomputing Lab
                        </span>
                    </td>
                    <td align="right" width="50" style="vertical-align: middle;">
                        <img src="https://res.cloudinary.com/n348amus/image/upload/v1784439510/HiveMind-Logo_qgmrdf.png" alt="HiveMind Logo" style="width: 40px; height: auto;">
                    </td>
                </tr>
            </table>
        </div>

        <!-- Body content -->
        <div style="color: #DDDDDD; font-size: 13px; line-height: 1.6; text-align: left; font-family: 'Segoe UI', Arial, sans-serif;">
            <p style="font-size: 14px; color: #FFFFFF; font-weight: bold; margin-bottom: 16px;">
                A new membership application has been submitted and is ready for review.
            </p>
            <p style="margin-bottom: 24px; color: #AAAAAA;">
                Please review the candidate's details, areas of interest, technical background, and submitted profiles before proceeding with the next stage of the selection process.
            </p>

            <!-- Candidate Details Card -->
            <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; margin-bottom: 14px; color: #FFC107; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                    Candidate Details
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: 'Segoe UI', Arial, sans-serif;">
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                        <td style="padding: 7px 0; color: #888888; width: 130px; font-weight: bold; text-transform: uppercase; font-size: 9px;">Full Name</td>
                        <td style="padding: 7px 0; color: #FFFFFF; font-weight: bold;">${escapedName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                        <td style="padding: 7px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 9px;">Register Number</td>
                        <td style="padding: 7px 0; color: #FFFFFF; font-weight: 500; font-family: monospace;">${escapedReg}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                        <td style="padding: 7px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 9px;">Email</td>
                        <td style="padding: 7px 0; color: #FFFFFF; font-weight: 500;"><a href="mailto:${email}" style="color: #FFC107; text-decoration: none; font-weight: bold;">${escapedEmail}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                        <td style="padding: 7px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 9px;">Phone Number</td>
                        <td style="padding: 7px 0; color: #FFFFFF; font-weight: 500;">+91 ${escapedPhone}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                        <td style="padding: 7px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 9px;">Department & Year</td>
                        <td style="padding: 7px 0; color: #FFFFFF; font-weight: 500;">${escapedDept} — ${escapedYear} Year</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                        <td style="padding: 7px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 9px;">Domains</td>
                        <td style="padding: 7px 0; color: #FFC107; font-weight: bold;">${escapedDomains}</td>
                    </tr>
                    <tr>
                        <td style="padding: 7px 0; color: #888888; font-weight: bold; text-transform: uppercase; font-size: 9px;">Languages</td>
                        <td style="padding: 7px 0; color: #FFFFFF; font-family: monospace; font-size: 11px;">${escapedLanguages}</td>
                    </tr>
                </table>
            </div>

            <!-- Why Join Statement -->
            <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; margin-bottom: 10px; color: #FFC107; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                    Why do you want to join HiveMind?
                </h3>
                <p style="margin: 0; font-size: 12px; color: #CCCCCC; white-space: pre-line; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">${escapedWhyJoin}</p>
            </div>

            <!-- Referral Source -->
            <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
                <h3 style="margin-top: 0; margin-bottom: 10px; color: #FFC107; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                    How did you hear about HiveMind?
                </h3>
                <p style="margin: 0; font-size: 12px; color: #CCCCCC; font-family: 'Segoe UI', Arial, sans-serif;">${escapedHowHear}</p>
            </div>

            <!-- Profiles & Attachments Action Buttons -->
            <div style="margin-bottom: 28px; text-align: center;">
                <a href="${resume}" target="_blank" style="background-color: #FFC107; color: #050505; padding: 10px 22px; border-radius: 8px; font-weight: 800; text-decoration: none; font-size: 11px; text-transform: uppercase; display: inline-block; margin: 4px; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: 0.5px;">
                    View Resume
                </a>
                <a href="${linkedin}" target="_blank" style="background-color: transparent; border: 1px solid rgba(255, 255, 255, 0.15); color: #FFFFFF; padding: 9px 22px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 11px; text-transform: uppercase; display: inline-block; margin: 4px; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: 0.5px;">
                    LinkedIn
                </a>
                ${github ? `
                <a href="${github}" target="_blank" style="background-color: transparent; border: 1px solid rgba(255, 255, 255, 0.15); color: #FFFFFF; padding: 9px 22px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 11px; text-transform: uppercase; display: inline-block; margin: 4px; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: 0.5px;">
                    GitHub
                </a>
                ` : ""}
                ${portfolio ? `
                <a href="${portfolio}" target="_blank" style="background-color: transparent; border: 1px solid rgba(255, 255, 255, 0.15); color: #FFFFFF; padding: 9px 22px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 11px; text-transform: uppercase; display: inline-block; margin: 4px; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: 0.5px;">
                    Portfolio
                </a>
                ` : ""}
            </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; margin-top: 20px; text-align: center; color: #555555; font-size: 9px; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5;">
            <div style="font-weight: 800; letter-spacing: 1px; color: #FFC107; margin-bottom: 3px; font-size: 10px;">HIVEMIND</div>
            <div style="margin-bottom: 3px;">Please access the HiveMind Admin Panel to review and manage this application.</div>
            <div style="color: #444444;">&copy; 2026 HiveMind</div>
        </div>
    </div>
</div>
    `;
};
exports.getLeadsNotificationEmail = getLeadsNotificationEmail;
const getInterviewInvitationEmail = (fullname, date, time) => {
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
    const paragraphs = [
        "We are pleased to inform you that your application has been shortlisted for the next stage of the HiveMind selection process.",
        "We would like to invite you to attend a Technical Interview with the HiveMind team. The interview will provide us with an opportunity to learn more about your technical knowledge, projects, problem-solving approach, interests, and willingness to learn.",
        "Please find the scheduled interview details below."
    ];
    const cardHtml = `
    <!-- Technical Interview Schedule Card -->
    <div style="background-color: rgba(255, 193, 7, 0.03); border: 1px solid rgba(255, 193, 7, 0.25); border-radius: 10px; padding: 20px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #FFC107; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
            Technical Interview
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: 'Segoe UI', Arial, sans-serif;">
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 8px 0; color: #888888; width: 35%; font-weight: 600; text-transform: uppercase; font-size: 10px;">Date</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-weight: 700; text-align: right;">${formattedDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 8px 0; color: #888888; font-weight: 600; text-transform: uppercase; font-size: 10px;">Time</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-weight: 700; text-align: right;">${time}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #888888; font-weight: 600; text-transform: uppercase; font-size: 10px;">Location</td>
                <td style="padding: 8px 0; color: #FFC107; font-weight: 700; text-align: right;">Supercomputing Lab</td>
            </tr>
        </table>
    </div>
    <p style="margin-bottom: 20px; color: #DDDDDD;">
        Please arrive on time and be prepared to discuss your technical interests, projects, experiences, and learning journey.
    </p>
    <p style="margin-bottom: 20px; color: #DDDDDD;">
        We look forward to meeting you.
    </p>
    `;
    return getCandidateEmailLayout("Technical Interview Invitation", "SHORTLISTED", 3, fullname, paragraphs, cardHtml);
};
exports.getInterviewInvitationEmail = getInterviewInvitationEmail;
const getCandidateAcceptanceEmail = (fullname) => {
    const paragraphs = [
        "Congratulations!",
        "We are delighted to inform you that you have successfully completed the HiveMind selection process and have been selected to join the community.",
        "Your application and interaction throughout the selection process demonstrated your potential, curiosity, and willingness to learn and contribute. We are excited to welcome you to HiveMind and look forward to seeing you collaborate, explore new ideas, and contribute to meaningful projects.",
        "Details regarding the onboarding process and other important information will be shared with you shortly.",
        "We look forward to having you as part of HiveMind."
    ];
    const specialBannerHtml = `
    <!-- Premium Acceptance Banner -->
    <div style="text-align: center; margin: 10px 0 25px 0; border: 1px dashed rgba(255, 193, 7, 0.3); padding: 16px; border-radius: 12px; background-color: rgba(255, 193, 7, 0.01);">
        <h3 style="margin: 0; color: #FFC107; font-size: 14px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase; font-family: 'Segoe UI', Arial, sans-serif;">
            WELCOME TO THE HIVE
        </h3>
    </div>
    `;
    return getCandidateEmailLayout("Welcome to HiveMind", "SELECTED", 3, fullname, paragraphs, "", specialBannerHtml, { border: "rgba(16, 185, 129, 0.3)", bg: "rgba(16, 185, 129, 0.03)", text: "#10B981" });
};
exports.getCandidateAcceptanceEmail = getCandidateAcceptanceEmail;
const getCandidateRejectionEmail = (fullname) => {
    const paragraphs = [
        "Thank you for your interest in joining HiveMind and for the time and effort you invested throughout the selection process.",
        "After careful consideration, we regret to inform you that we will not be able to move forward with your application at this time.",
        "We sincerely appreciate your interest in being part of HiveMind and encourage you to continue learning, building, and developing your skills. We welcome you to apply again during future recruitment opportunities.",
        "We wish you the very best in your future endeavors."
    ];
    return getCandidateEmailLayout("Application Update", "APPLICATION STATUS", 3, fullname, paragraphs, "", "", { border: "rgba(255, 255, 255, 0.15)", bg: "rgba(255, 255, 255, 0.02)", text: "#888888" });
};
exports.getCandidateRejectionEmail = getCandidateRejectionEmail;
