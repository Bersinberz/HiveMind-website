import { useEffect, useState } from "react";
import Navbar from "../../compoenets/Navbar";
import ProjectServices, { type Project } from "../../services/admin/ProjectServices";

const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <div className="group relative bg-[#0c0c0e]/30 backdrop-blur-md border border-white/5 hover:border-gold-primary/30 rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-[0_15px_35px_rgba(255,193,7,0.05)]">
            {/* Widescreen 16:9 Aspect Ratio Container */}
            <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center border-b border-white/5">
                {project.thumbnail ? (
                    <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/[0.01] text-white/20 select-none">
                        <span className="text-xs font-bold uppercase tracking-wider">No Cover Image</span>
                    </div>
                )}
                {/* Domain Hover Accent */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-gold-primary text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md z-10">
                    {Array.isArray(project.domain) ? project.domain.join(" • ") : project.domain}
                </div>
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white group-hover:text-gold-primary transition-colors">
                        {project.title}
                    </h3>
                    <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                        {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - {new Date(project.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                    <p className="text-xs text-[#BBBBBB] leading-relaxed line-clamp-3">
                        {project.description}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech, idx) => (
                            <span 
                                key={idx} 
                                className="bg-white/5 border border-white/10 text-[#CCCCCC] text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded font-mono"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Social/Demo Links */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-white/60 hover:text-gold-primary text-[10px] sm:text-xs font-extrabold uppercase tracking-widest transition-colors no-underline"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                            GitHub
                        </a>

                        {project.liveDemo && (
                            <a 
                                href={project.liveDemo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-white/60 hover:text-gold-primary text-[10px] sm:text-xs font-extrabold uppercase tracking-widest transition-colors no-underline animate-pulse"
                            >
                                Live Demo
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    useEffect(() => {
        ProjectServices.getProjects()
            .then(res => {
                if (res.success && res.projects) {
                    setProjects(res.projects);
                }
            })
            .catch(err => {
                console.error("Error loading projects:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Extract unique domains dynamically
    const domains = ["All", ...Array.from(new Set(projects.flatMap(p => p.domain))).filter(Boolean)];

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "All" || (Array.isArray(project.domain) ? project.domain.includes(activeTab) : project.domain === activeTab);
        return matchesSearch && matchesTab;
    });

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            <Navbar />

            <main className="flex-1 z-10 pt-28 pb-16 px-6 md:px-[10%] flex flex-col items-center">
                <section className="relative flex flex-col items-center text-white py-12 px-2 z-10 w-full max-w-7xl">
                    <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                        Our Innovation
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-10 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                        Research & Projects
                    </h2>

                    {/* Filter Tabs & Search Bar */}
                    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/[0.01] border border-white/5 p-4 sm:p-5 rounded-3xl backdrop-blur-lg">
                        {/* Domain Tabs */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
                            {domains.map(domain => {
                                const isActive = activeTab === domain;
                                return (
                                    <button
                                        key={domain}
                                        onClick={() => setActiveTab(domain)}
                                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                                            isActive
                                                ? "bg-gold-primary/10 border-gold-primary/20 text-gold-primary [text-shadow:0_0_10px_rgba(255,193,7,0.25)] shadow-[0_4px_15px_rgba(255,193,7,0.05)]"
                                                : "bg-transparent border-transparent text-[#888888] hover:text-white"
                                        }`}
                                    >
                                        {domain}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72">
                            <input 
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#050505]/40 border border-white/10 focus:border-gold-primary/40 focus:outline-none rounded-full py-2.5 pl-5 pr-10 text-xs text-white placeholder-white/30 transition-colors"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                    </div>

                    {/* Cards Display Grid */}
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin" />
                            <span className="text-[10px] text-[#888888] uppercase tracking-widest font-black">Assembling Projects...</span>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="py-20 text-center w-full">
                            <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">No projects found</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
                            {filteredProjects.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Simple Footer */}
            <footer className="z-10 py-8 border-t border-white/5 text-center bg-[#050505] text-[10px] text-[#666666] uppercase tracking-widest font-bold">
                © {new Date().getFullYear()} HiveMind Sathyabama. All rights reserved.
            </footer>
        </div>
    );
}
