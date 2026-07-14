import { useState } from "react";
import Navbar from "../../compoenets/Navbar";

interface StaticTeamMember {
    id: string;
    fullname: string;
    department: string;
    year: string;
    Linkedin?: string;
    github?: string;
    pic?: string;
}

const mockTeam: StaticTeamMember[] = [
    {
        id: "1",
        fullname: "Rahul S.",
        department: "Generative AI",
        year: "3rd",
        Linkedin: "https://linkedin.com",
        github: "https://github.com",
        pic: "/bersin_password_size.jpg",
    },
    {
        id: "2",
        fullname: "Dr. Anitha P.",
        department: "Deep Learning",
        year: "Faculty Mentor",
        Linkedin: "https://linkedin.com",
        pic: "anto.jpeg",
    },
    {
        id: "3",
        fullname: "Priya K.",
        department: "MLOps & Infra",
        year: "Alumni",
        github: "https://github.com",
        pic: "/bersin_password_size.jpg",
    },
    {
        id: "4",
        fullname: "Aditya Kumar",
        department: "LLMs & RAG",
        year: "3rd",
        Linkedin: "https://linkedin.com",
        github: "https://github.com",
        pic: "/bersin_password_size.jpg",
    },
    {
        id: "5",
        fullname: "Sneha Reddy",
        department: "Computer Vision",
        year: "2nd",
        Linkedin: "https://linkedin.com",
        pic: "/bersin_password_size.jpg",
    },
    {
        id: "6",
        fullname: "Vikram Sen",
        department: "AI Agents",
        year: "4th",
        github: "https://github.com",
        pic: "/bersin_password_size.jpg",
    }
];

const HexagonCard = ({ member }: { member: StaticTeamMember }) => {
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
                        <span className="text-xs sm:text-sm text-[#888888] uppercase tracking-widest block mb-4">
                            {member.department}
                        </span>
                        <span className="text-[10px] sm:text-xs text-[#666666] uppercase tracking-widest block mb-6">
                            {member.year !== "Faculty Mentor" && member.year !== "Alumni" ? `${member.year} Year` : member.year}
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

export default function Team() {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            <Navbar />
            
            <main className="flex-1 z-10 pt-28 pb-16 flex flex-col items-center justify-center">
                <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] z-10 w-full" id="team">
                    <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                        Our Crew
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                        Core Lab Members
                    </h2>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-7xl w-full">
                        {mockTeam.map(member => (
                            <HexagonCard key={member.id} member={member} />
                        ))}
                    </div>
                </section>
            </main>

            {/* Simple Footer */}
            <footer className="z-10 py-8 border-t border-white/5 text-center bg-[#050505] text-[10px] text-[#666666] uppercase tracking-widest font-bold">
                © {new Date().getFullYear()} HiveMind Sathyabama. All rights reserved.
            </footer>
        </div>
    );
}
