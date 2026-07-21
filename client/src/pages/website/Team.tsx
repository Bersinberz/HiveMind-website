import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../compoenets/Navbar";
import Footer from "../../compoenets/Footer";
import TeammanagemntServices, { type TeamMember } from "../../services/admin/TeammanagemntServices";

const HexagonCard = ({ member }: { member: TeamMember }) => {
    const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        // Normalize mouse coordinates relative to card center (-0.5 to 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Max tilt of 15 degrees
        const maxTilt = 15;
        const rotateX = -y * maxTilt;
        const rotateY = x * maxTilt;

        setTiltStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
        });
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative w-72 h-84 sm:w-80 sm:h-92 p-[1.5px] transition-transform duration-200 ease-out hover:shadow-[0_25px_55px_rgba(255,193,7,0.18)] cursor-pointer"
            style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                transformStyle: "preserve-3d",
                ...tiltStyle
            }}
        >
            {/* Hexagonal Gold Border Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/30 to-gold-primary/80 group-hover:from-gold-primary group-hover:to-gold-light transition-all duration-300" />

            {/* Hexagonal Inner Content Wrapper */}
            <div
                className="relative w-full h-full bg-[#0c0c0e] overflow-hidden flex flex-col items-center justify-center"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            >
                {/* Profile Photo */}
                {member.pic ? (
                    <img
                        src={member.pic}
                        alt={member.fullname}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-white/[0.02] flex flex-col items-center justify-center text-white/40">
                        <span className="text-4xl font-extrabold uppercase tracking-widest">
                            {member.fullname.substring(0, 2)}
                        </span>
                    </div>
                )}

                {/* Hover overlay details - Name, Dept, Year and Socials reveal on hover from the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent flex flex-col items-center justify-end pb-12 px-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 select-none">
                    <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col items-center w-full">
                        <span className="text-base sm:text-lg font-extrabold text-gold-sweep uppercase tracking-wider block mb-1">
                            {member.fullname}
                        </span>
                        <span className="text-xs sm:text-sm text-[#888888] uppercase tracking-widest block mb-2">
                            {member.department}
                        </span>
                        <span className="text-[10px] sm:text-xs text-[#666666] uppercase tracking-widest block mb-1">
                            {member.year} Year
                        </span>
                        <span className="text-[9px] text-[#555555] uppercase tracking-widest block mb-6">
                            Batch {member.batch}
                        </span>

                        {/* Social links with logos */}
                        <div className="flex items-center justify-center gap-4">
                            {member.Linkedin && (
                                <a
                                    href={member.Linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-gold-primary hover:text-gold-primary flex items-center justify-center text-[#AAAAAA] transition-colors shadow-sm"
                                    title="LinkedIn"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                        <rect x="2" y="9" width="4" height="12" />
                                        <circle cx="4" cy="4" r="2" />
                                    </svg>
                                </a>
                            )}
                            {member.github && (
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-gold-primary hover:text-gold-primary flex items-center justify-center text-[#AAAAAA] transition-colors shadow-sm"
                                    title="GitHub"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const cardContainerVariants: any = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

const cardVariants: any = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function Team({ showSplash }: { showSplash?: boolean }) {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        TeammanagemntServices.getTeamMembers()
            .then(res => {
                if (res.success && res.members) {
                    setTeamMembers(res.members);
                }
            })
            .catch(err => {
                console.error("Error fetching team members:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div
            className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: "url('/assets/join_bg.png')" }}
        >
            {/* Dark overlay backdrop to keep content readable */}
            <div className="absolute inset-0 bg-[#050505]/80 z-0 pointer-events-none" />

            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            <Navbar showSplash={showSplash} />

            <main className="flex-1 z-10 pt-28 pb-16 flex flex-col items-center justify-center">
                <section className="relative flex flex-col items-center bg-transparent text-white pt-2 pb-16 md:pt-4 md:pb-24 px-6 md:px-[10%] z-10 w-full" id="team">
                    {/* --- UNIFIED HERO SECTION --- */}
                    <div className="w-full flex flex-col items-center justify-center pt-4 pb-16 md:pb-24 border-b border-white/5 relative">
                        {/* Upper Hero Intro */}
                        <div className="flex flex-col items-center justify-center text-center px-4 mb-16 md:mb-24">
                            <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                                THE MINDS BEHIND THE HIVE
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-4 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                                MEET OUR TEAM
                            </h2>
                            <p className="text-sm md:text-base text-[#888888] text-center max-w-xl leading-relaxed uppercase tracking-wider font-semibold">
                                A collective of curious minds building, learning, and innovating together
                            </p>
                        </div>

                        {/* Lower Hero Content (Our Collective editorial grid) */}
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 px-4 items-start text-left">
                            {/* Left Side: Label & Heading */}
                            <div className="md:col-span-5 space-y-4">
                                <span className="text-[10px] sm:text-xs font-bold text-gold-primary uppercase tracking-[0.25em] [text-shadow:0_0_10px_rgba(255,193,7,0.2)] block">
                                    OUR COLLECTIVE
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white leading-tight bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                                    Built by People.<br />Driven by Curiosity.
                                </h3>
                            </div>

                            {/* Visual Connector Line */}
                            <div className="hidden md:flex md:col-span-1 justify-center h-full min-h-[220px]">
                                <div className="w-[1px] h-full min-h-[220px] bg-gradient-to-b from-gold-primary/40 via-gold-primary/10 to-transparent" />
                            </div>

                            {/* Right Side: Paragraphs */}
                            <div className="md:col-span-6 space-y-6 text-sm sm:text-base leading-relaxed text-[#888888] font-medium">
                                <p>
                                    HiveMind brings together individuals with diverse skills, ideas, and perspectives, united by a shared passion for technology, research, and innovation. We believe that meaningful ideas emerge when curious minds come together — sharing knowledge, challenging perspectives, and learning from one another.
                                </p>
                                <p>
                                    Our members explore emerging technologies, collaborate on ambitious projects, experiment with new ideas, and transform curiosity into practical solutions. Every contribution brings a unique perspective to the collective.
                                </p>
                                <p className="text-white/70">
                                    At HiveMind, growth is not an individual journey. Every member brings their own strengths and experiences while learning alongside others. Together, we create an environment where ideas evolve, skills grow, and people build things that matter.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* --- END OF HERO SECTION --- */}

                    {/* --- TRANSITION SECTION --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center text-center py-20 w-full"
                    >
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-white select-none">
                            TOGETHER, WE ARE <span className="text-gold-primary [text-shadow:0_0_8px_rgba(255,193,7,0.3)]">HIVEMIND.</span>
                        </h4>
                        
                        {/* Downward indicator line */}
                        <div className="w-[1px] h-20 relative mt-6 overflow-hidden">
                            <motion.div 
                                initial={{ scaleY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
                                className="absolute inset-0 bg-gradient-to-b from-gold-primary via-gold-primary/50 to-transparent origin-top"
                            />
                        </div>
                    </motion.div>

                    {/* --- TEAM MEMBER GRID HEADER --- */}
                    <div className="w-full flex flex-col items-center justify-center mb-12 text-center" id="members-list">
                        <span className="text-[9px] font-bold text-gold-primary/60 uppercase tracking-[0.25em] mb-2">
                            OUR PEOPLE
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-widest bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                            THE HIVEMIND COLLECTIVE
                        </h2>
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent mt-2" />
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin" />
                            <span className="text-[10px] text-[#888888] uppercase tracking-widest font-black">Assembling Crew...</span>
                        </div>
                    ) : teamMembers.length === 0 ? (
                        <div className="py-20 text-center">
                            <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">No team members found</span>
                        </div>
                    ) : (
                        <motion.div
                            variants={cardContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.02 }}
                            className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-7xl w-full"
                        >
                            {teamMembers.map(member => (
                                <motion.div key={member._id} variants={cardVariants}>
                                    <HexagonCard member={member} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
