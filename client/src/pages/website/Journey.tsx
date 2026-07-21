import { useState, useEffect } from "react";
import Navbar from "../../compoenets/Navbar";
import Footer from "../../compoenets/Footer";
import axiosInstance from "../../services/axiosInstance";
import TelemetryServices from "../../services/admin/TelemetryServices";
import { motion } from "framer-motion";

function HoneycombPattern({ className = "opacity-[0.03]" }: { className?: string }) {
    return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className} text-white`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="journey-honeycomb" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                    <path d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 97 L56 81 L56 49 L28 33 L0 49 L0 81 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#journey-honeycomb)" />
        </svg>
    );
}

const generationsData = [
    {
        id: "01",
        label: "GENESIS • 01",
        title: "The Founding Batch",
        tagline: "The minds that started the Hive.",
        desc: "The founding generation that laid the foundation of HiveMind, shaping its vision, culture, and commitment to innovation.",
        buttonText: "Meet the Founding Batch →"
    },
    {
        id: "02",
        label: "GENERATION • 02",
        title: "The Next Chapter",
        tagline: "Building on the foundation. Expanding the vision.",
        desc: "The generation carrying the HiveMind vision forward — exploring new technologies, building ambitious projects, and growing the community.",
        buttonText: "Meet Generation 02 →"
    }
];

export default function Journey({ showSplash }: { showSplash?: boolean }) {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        // Record visitor telemetry
        TelemetryServices.recordVisit("/journey")
            .catch(err => console.error("Failed to log visit:", err));

        axiosInstance.get("/v1/community-settings")
            .then(res => {
                if (res.data && res.data.success) {
                    setSettings(res.data.settings);
                }
            })
            .catch(err => {
                console.error("Failed to load community settings:", err);
            });
    }, []);

    const communityName = settings?.communityName || "HiveMind";

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.025)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.025)_0%,transparent_70%)] pointer-events-none z-0" />

            <HoneycombPattern className="opacity-[0.03]" />

            <Navbar showSplash={showSplash} />

            <main className="flex-1 z-10 pt-28 pb-16 px-6 md:px-[10%] flex flex-col items-center justify-start">
                {/* Page Header */}
                <section className="relative flex flex-col items-center text-white py-12 px-2 z-10 w-full max-w-3xl text-center">
                    <motion.span
                        initial={{ opacity: 0, y: -12, letterSpacing: "0.1em" }}
                        animate={{ opacity: 1, y: 0, letterSpacing: "0.3em" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-[10px] font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)] block"
                    >
                        OUR JOURNEY
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                        className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide mb-6 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent"
                    >
                        Generations of {communityName}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="text-xs sm:text-sm text-[#9D9D9D] leading-relaxed max-w-xl"
                    >
                        Every generation brings new minds, new ideas, and new possibilities — building upon the foundation laid by those who came before.
                    </motion.p>
                </section>

                {/* Generations Main Section */}
                <section className="relative flex flex-col items-center w-full max-w-5xl py-8">
                    {/* Connecting Timeline Lines */}
                    {/* Horizontal connector line on desktop */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute top-[32px] left-[25%] right-[25%] h-[2px] bg-gradient-to-r from-gold-primary/10 via-gold-primary/50 to-gold-primary/10 hidden md:block origin-left z-0"
                    />
                    {/* Vertical connector line on mobile */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute left-1/2 top-[32px] bottom-[32px] w-[2px] bg-gradient-to-b from-gold-primary/10 via-gold-primary/50 to-gold-primary/10 md:hidden origin-top z-0"
                    />

                    <div className="relative flex flex-col md:flex-row items-stretch justify-center gap-16 md:gap-12 w-full">
                        {generationsData.map((gen, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center z-10 relative">
                                {/* Hexagon Node */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -30 }}
                                    whileInView={{ scale: 1, rotate: 0 }}
                                    viewport={{ once: false, amount: 0.15 }}
                                    transition={{ type: "spring", stiffness: 90, damping: 14, delay: index * 0.25 }}
                                    className="relative z-10 mb-6 flex items-center justify-center"
                                >
                                    <svg className="w-16 h-16 text-gold-primary drop-shadow-[0_0_12px_rgba(255,193,7,0.35)]" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M50 2.5 L93.3 27.5 L93.3 77.5 L50 102.5 L6.7 77.5 L6.7 27.5 Z" stroke="currentColor" strokeWidth="2.5" fill="#050505" />
                                        <path d="M50 15 L80 32.5 L80 67.5 L50 85 L20 67.5 L20 32.5 Z" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
                                        <polygon points="50,40 63,47.5 63,62.5 50,70 37,62.5 37,47.5" fill="currentColor" className="animate-pulse" />
                                    </svg>
                                    <span className="absolute text-[10px] font-black text-white select-none">
                                        {gen.id}
                                    </span>
                                </motion.div>

                                {/* Vertical Stem Connector */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: 32 }}
                                    viewport={{ once: false, amount: 0.15 }}
                                    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.25 + 0.15 }}
                                    className="w-[1.5px] bg-gradient-to-b from-gold-primary to-transparent z-0 mb-2"
                                />

                                {/* Generation Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.15 }}
                                    transition={{ duration: 0.7, delay: index * 0.25 + 0.25, ease: "easeOut" }}
                                    className="relative flex flex-col items-center text-center w-full max-w-sm bg-[#0c0c0e]/30 backdrop-blur-md border border-white/5 hover:border-gold-primary/30 rounded-3xl p-6 sm:p-8 transition-[border-color,background-color] duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-default group"
                                >
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />
                                    
                                    <span className="text-[10px] font-black text-gold-primary tracking-[0.25em] uppercase mb-2 block">
                                        {gen.label}
                                    </span>
                                    
                                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide mb-1 transition-colors duration-300 group-hover:text-gold-light">
                                        {gen.title}
                                    </h3>
                                    
                                    <span className="text-xs text-[#888888] font-medium tracking-wide uppercase block mb-4 italic">
                                        "{gen.tagline}"
                                    </span>
                                    
                                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent mb-5" />
                                    
                                    <p className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed text-justify mb-8 flex-1">
                                        {gen.desc}
                                    </p>

                                    {/* Dummy Button matching Sathyabama Button style */}
                                    <motion.button
                                        whileHover={{ scale: 1.04, translateY: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="bg-transparent border border-white/10 hover:border-gold-primary/40 text-white text-[10px] font-extrabold uppercase py-3.5 px-6 rounded-full cursor-pointer transition-colors duration-300 tracking-widest"
                                    >
                                        {gen.buttonText}
                                    </motion.button>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
