import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CommunitySettingsServices, { type ICommunitySettings } from "../services/admin/CommunitySettingsServices";

function HoneycombPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.02] text-white" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="footer-honeycomb" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                    <path d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 97 L56 81 L56 49 L28 33 L0 49 L0 81 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-honeycomb)" />
        </svg>
    );
}

// Neural divider replaced with centered Community Name at layout top

export default function Footer() {
    const location = useLocation();

    const [settings, setSettings] = useState<ICommunitySettings | null>(null);

    useEffect(() => {
        CommunitySettingsServices.getSettings()
            .then(res => {
                if (res.success && res.settings) {
                    setSettings(res.settings);
                }
            })
            .catch(() => {});
    }, []);



    // Database fallback values
    const primaryEmail = settings?.primaryEmail || "hivemind@sathyabama.ac.in";
    const githubUrl = settings?.github || "https://github.com";
    const linkedinUrl = settings?.linkedin || "https://linkedin.com";
    const addressLocation = settings?.location || "AI Supercomputing Lab, Sathyabama Institute of Science and Technology, OMR, Chennai - 600119";
    const contactNumber = settings?.contactNumber || "+91 (44) 2450 3150";
    const displayPhone = contactNumber.startsWith("+") ? contactNumber : `+91 ${contactNumber}`;
    const cleanTelNumber = contactNumber.startsWith("+") ? contactNumber : `+91${contactNumber}`;

    // Framer Motion Animation Variants
    const columnVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: "easeOut" }
        }
    } as const;

    return (
        <footer className="relative bg-[#050505] text-white border-t border-white/5 pt-16 pb-8 px-6 md:px-[10%] z-20 overflow-hidden">
            {/* Visual background treatment */}
            <HoneycombPattern />

            {/* Radial glow behind brand area */}
            <div className="absolute top-0 left-[-5%] w-[40%] h-[55%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_75%)] pointer-events-none z-0 blur-[40px]" />

            <div className="relative max-w-7xl mx-auto z-10">
                {/* Center-aligned Logo & Community Name at the top */}
                <div className="flex flex-col items-center justify-center mb-12 text-center select-none">
                    <Link
                        to="/"
                        onClick={(e) => {
                            if (location.pathname === "/") {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                        className="group flex flex-col items-center gap-4 no-underline cursor-pointer"
                    >
                        <img
                            src="/assets/HiveMind-Logo.png"
                            alt="HiveMind Logo"
                            className="h-20 w-auto filter drop-shadow-[0_0_15px_rgba(255,193,7,0.4)] transition-transform duration-500 group-hover:scale-108 group-hover:rotate-2"
                        />
                        <span className="text-3xl md:text-5xl font-black uppercase tracking-[0.3em] bg-gradient-to-r from-white via-[#DDDDDD] to-gold-primary bg-clip-text text-transparent [text-shadow:0_0_15px_rgba(255,193,7,0.15)]">
                            {settings?.communityName || "HiveMind"}
                        </span>
                    </Link>
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent mt-4" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10 lg:gap-8 items-start pb-12">

                    {/* COLUMN 1: HIVEMIND BRAND */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >

                        <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-[11px] font-bold tracking-wider text-[#AAAAAA] uppercase">
                                Engineering Intelligence.
                            </span>
                            <span className="text-[11px] font-black tracking-[0.18em] text-gold-primary uppercase">
                                BUILDING THE FUTURE.
                            </span>
                        </div>

                        <p className="text-[11px] text-[#777777] leading-relaxed max-w-[260px] font-medium mt-2">
                            A community of innovators, researchers, and developers building intelligent systems and exploring emerging technologies.
                        </p>
                    </motion.div>

                    {/* COLUMN 2: EXPLORE */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <span className="text-[10px] font-black text-[#CCCCCC] uppercase tracking-[0.25em] mb-1">
                            Explore
                        </span>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0 w-full">
                            <li>
                                <Link
                                    to="/"
                                    onClick={(e) => {
                                        if (location.pathname === "/") {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }}
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/team"
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Team
                                </Link>

                            </li>

                        </ul>
                    </motion.div>

                    {/* COLUMN 3: COMMUNITY */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <span className="text-[10px] font-black text-[#CCCCCC] uppercase tracking-[0.25em] mb-1">
                            Community
                        </span>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0 w-full">
                            <li>
                                <Link
                                    to="/join"
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Join HiveMind
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/projects"
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/events"
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Events
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* COLUMN 4: CONNECT */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <span className="text-[10px] font-black text-[#CCCCCC] uppercase tracking-[0.25em] mb-1">
                            Connect
                        </span>

                        <div className="flex items-center gap-3.5 mt-1">
                            {/* GitHub */}
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.01] border border-white/5 text-white/50 hover:text-gold-primary hover:border-gold-primary/40 hover:shadow-[0_0_10px_rgba(255,193,7,0.25)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                                aria-label="Follow HiveMind on GitHub"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                            </a>
                            {/* LinkedIn */}
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.01] border border-white/5 text-white/50 hover:text-gold-primary hover:border-gold-primary/40 hover:shadow-[0_0_10px_rgba(255,193,7,0.25)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                                aria-label="Connect with HiveMind on LinkedIn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect x="2" y="9" width="4" height="12" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </a>
                        </div>

                        {/* Plain text contact details with logos */}
                        <div className="flex flex-col gap-3 mt-2 text-[11px] text-[#777777] leading-relaxed font-medium">
                            {/* Location Link & Pin Logo */}
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary flex-shrink-0">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <a
                                    href="https://www.sathyabama.ac.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gold-primary text-[#777777] transition-colors no-underline text-left"
                                >
                                    {addressLocation}
                                </a>
                            </div>

                            {/* Email Link & Mail Logo */}
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary flex-shrink-0">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <a href={`mailto:${primaryEmail}`} className="hover:text-gold-primary text-[#777777] transition-colors no-underline">
                                    {primaryEmail}
                                </a>
                            </div>

                            {/* Phone Link & Phone Logo */}
                            {contactNumber && (
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary flex-shrink-0">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <a href={`tel:${cleanTelNumber.replace(/\s+/g, '')}`} className="hover:text-gold-primary text-[#777777] transition-colors no-underline">
                                        {displayPhone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Copyright Section */}
                <div className="pt-8 mt-4 border-t border-white/5 flex items-center justify-center text-[10px] text-[#555555] uppercase tracking-widest font-black text-center w-full">
                    <div>
                        © {new Date().getFullYear()} {settings?.communityName || "HiveMind"}. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
