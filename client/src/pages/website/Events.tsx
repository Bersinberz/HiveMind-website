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
                <pattern id="events-honeycomb" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                    <path d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 97 L56 81 L56 49 L28 33 L0 49 L0 81 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#events-honeycomb)" />
        </svg>
    );
}

const HexSwarm = () => {
    const d = 34.64;
    const centers = [
        { x: 100, y: 100, delay: 0 },
        { x: 100, y: 100 - d, delay: 0.25 },
        { x: 100 + 30, y: 100 - 17.32, delay: 0.5 },
        { x: 100 + 30, y: 100 + 17.32, delay: 0.75 },
        { x: 100, y: 100 + d, delay: 1.0 },
        { x: 100 - 30, y: 100 + 17.32, delay: 1.25 },
        { x: 100 - 30, y: 100 - 17.32, delay: 1.5 }
    ];

    const getHexPoints = (cx: number, cy: number, r: number) => {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60 - 30) * Math.PI / 180; // pointy topped
            points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return points.join(" ");
    };

    return (
        <svg viewBox="0 0 200 200" className="w-36 h-36 md:w-44 md:h-44 filter drop-shadow-[0_0_20px_rgba(255,193,7,0.3)]">
            {centers.map((c, idx) => (
                <motion.polygon
                    key={idx}
                    points={getHexPoints(c.x, c.y, 16)}
                    className="fill-black/60 stroke-gold-primary"
                    strokeWidth="1.5"
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        fill: ["rgba(255,193,7,0.02)", "rgba(255,193,7,0.3)", "rgba(255,193,7,0.02)"],
                        stroke: ["#FFC107", "#FFD54F", "#FFC107"]
                    }}
                    transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        delay: c.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </svg>
    );
};

export default function Events({ showSplash }: { showSplash?: boolean }) {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        TelemetryServices.recordVisit("/events")
            .catch(() => {});

        axiosInstance.get("/v1/community-settings")
            .then(res => {
                if (res.data && res.data.success) {
                    setSettings(res.data.settings);
                }
            })
            .catch(() => {});
    }, []);

    const communityName = settings?.communityName || "HiveMind";

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.025)_0%,transparent_70%)] pointer-events-none z-0 filter blur-[80px]" />
            <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.025)_0%,transparent_70%)] pointer-events-none z-0 filter blur-[80px]" />

            <HoneycombPattern className="opacity-[0.02]" />

            <Navbar showSplash={showSplash} />

            <main className="flex-1 z-10 flex flex-col items-center justify-center pt-24 pb-12 px-6">
                <div className="relative flex flex-col items-center justify-center max-w-lg w-full text-center py-6">
                    
                    {/* Glowing Hex Swarm Loader */}
                    <div className="relative mb-8 flex items-center justify-center">
                        <HexSwarm />
                    </div>

                    {/* Animated Text Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-4 px-4"
                    >
                        <span className="text-[10px] font-bold text-gold-primary uppercase tracking-[0.4em] [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                            STATUS • STANDBY
                        </span>
                        
                        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                            Stay tuned for events
                        </h1>

                        <p className="text-xs sm:text-sm text-[#888888] max-w-sm mx-auto leading-relaxed">
                            No events currently running. {communityName} is planning the next big workshop, hackathon, and developer meetup. Check back soon!
                        </p>
                    </motion.div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
