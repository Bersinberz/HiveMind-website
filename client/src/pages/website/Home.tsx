import { type FormEvent, useState, useEffect } from "react";
import Navbar from "../../compoenets/Navbar";
import HeroSection from "../../compoenets/HeroSection";
import ProjectServices, { type Project } from "../../services/admin/ProjectServices";

// ==========================================
// ABOUT SECTION COMPONENT
// ==========================================
function AboutSection() {
    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="about">
            <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                Overview
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-8 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                About HiveMind
            </h2>

            <div className="w-full max-w-4xl mx-auto">
                <p className="text-base md:text-lg leading-[1.8] text-[#CCCCCC] text-justify">
                    HiveMind is a student-driven Artificial Intelligence community at Sathyabama Institute of Science and Technology, operating from the AI Supercomputing Laboratory in the SCAS Block. We bring together passionate students who share a common vision of exploring, building, and advancing AI through hands-on learning, research, and innovation. Our members work on cutting-edge technologies such as Generative AI, Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Transformers, Computer Vision, Deep Learning, AI Agents, MLOps, and cloud-based AI solutions, transforming ideas into impactful real-world applications. Guided by experienced faculty mentors, HiveMind fosters a collaborative environment where curiosity meets engineering, empowering students to contribute to open-source projects, participate in hackathons, conduct research, and develop intelligent systems that shape the future of technology.
                </p>
            </div>
        </section>
    );
}

// ==========================================
// MISSION SECTION COMPONENT
// ==========================================
function MissionSection() {
    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="mission">
            <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                Our Purpose
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                Mission of HiveMind
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {/* Pillar 1: Explore */}
                <div className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center transition-all duration-400 flex flex-col items-center hover:-translate-y-2 hover:border-gold-primary/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.05)_0%,transparent_60%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400">
                    <div className="relative z-10 w-[70px] h-[70px] rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-8 text-gold-primary transition-all duration-400 group-hover:bg-gold-primary group-hover:text-black group-hover:scale-110 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16.2 7.8l-2 5.6-5.6 2 2-5.6 5.6-2z" />
                        </svg>
                    </div>
                    <h3 className="relative z-10 text-lg font-bold mb-4 text-white tracking-wider uppercase transition-colors duration-400 group-hover:text-gold-primary">
                        Explore
                    </h3>
                    <p className="relative z-10 text-sm text-[#A0A0A0] leading-relaxed">
                        Curiosity-driven mapping of emerging AI fields. We dive deep into theoretical foundations, investigate new frameworks, and dissect cutting-edge literature to understand where technology is going.
                    </p>
                </div>

                {/* Pillar 2: Build */}
                <div className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center transition-all duration-400 flex flex-col items-center hover:-translate-y-2 hover:border-gold-primary/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.05)_0%,transparent_60%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400">
                    <div className="relative z-10 w-[70px] h-[70px] rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-8 text-gold-primary transition-all duration-400 group-hover:bg-gold-primary group-hover:text-black group-hover:scale-110 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M16.5 9.4 7.55 4.24a1.79 1.79 0 0 0-1.8 0L2.5 6v12l3.25 1.76a1.79 1.79 0 0 0 1.8 0L16.5 14.6V9.4z" />
                            <path d="m7 4.75 9.5 5.45" />
                            <path d="M7 19.25V9.45" />
                            <path d="M16.5 9.4 21.5 6.5a1.79 1.79 0 0 1 1.8 0L26.5 8.2v12l-3.25 1.76a1.79 1.79 0 0 1-1.8 0L16.5 19V9.4z" />
                            <path d="m21.5 21.25V11.45" />
                            <path d="m21.5 6.5-5 2.9" />
                        </svg>
                    </div>
                    <h3 className="relative z-10 text-lg font-bold mb-4 text-white tracking-wider uppercase transition-colors duration-400 group-hover:text-gold-primary">
                        Build
                    </h3>
                    <p className="relative z-10 text-sm text-[#A0A0A0] leading-relaxed">
                        Translating formulas into functional algorithms. In the AI Supercomputing Lab, we write clean code, build autonomous AI agents, deploy custom LLM pipelines, and contribute to the open-source ecosystem.
                    </p>
                </div>

                {/* Pillar 3: Advance */}
                <div className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center transition-all duration-400 flex flex-col items-center hover:-translate-y-2 hover:border-gold-primary/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.05)_0%,transparent_60%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400">
                    <div className="relative z-10 w-[70px] h-[70px] rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-8 text-gold-primary transition-all duration-400 group-hover:bg-gold-primary group-hover:text-black group-hover:scale-110 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
                        </svg>
                    </div>
                    <h3 className="relative z-10 text-lg font-bold mb-4 text-white tracking-wider uppercase transition-colors duration-400 group-hover:text-gold-primary">
                        Advance
                    </h3>
                    <p className="relative z-10 text-sm text-[#A0A0A0] leading-relaxed">
                        Pioneering new solutions and publishing research. We channel our projects into hackathons, intellectual property patents, and academic research papers to push the frontier of student-led AI development.
                    </p>
                </div>
            </div>
        </section>
    );
}

// ==========================================
// DOMAINS SECTION COMPONENT
// ==========================================
function DomainsSection() {
    const technologies = [
        "Generative AI & LLMs",
        "RAG & AI Agents",
        "Deep Learning",
        "Computer Vision",
        "MLOps & Infrastructure",
        "LLaMA 3",
        "Hugging Face",
        "LoRA/QLoRA",
        "OpenAI API",
        "LangChain",
        "LlamaIndex",
        "Pinecone & Chroma",
        "CrewAI",
        "PyTorch",
        "TensorFlow",
        "Jax",
        "Stable Diffusion",
        "OpenCV",
        "YOLO v8",
        "Segment Anything",
        "Docker",
        "Kubernetes",
        "FastAPI",
        "Triton Server",
        "AWS & GCP"
    ];

    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="domains">
            <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                Our Stack
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                Technology Domains
            </h2>

            <div className="flex flex-wrap justify-center gap-4 max-w-5xl w-full">
                {technologies.map((tech, index) => (
                    <div
                        key={index}
                        className="bg-white/[0.02] border border-white/5 hover:border-gold-primary/30 hover:bg-gold-primary/[0.02] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,193,7,0.05)] rounded-2xl py-4 px-8 text-sm font-semibold tracking-wider text-[#DDDDDD] hover:text-gold-light uppercase transition-all duration-300 select-none cursor-default"
                    >
                        {tech}
                    </div>
                ))}
            </div>
        </section>
    );
}

// ==========================================
// TESTIMONIALS SECTION COMPONENT
// ==========================================
function TestimonialsSection() {
    const testimonials = [
        {
            text: "Being part of HiveMind changed my perspective on engineering. Working in the AI Supercomputing Lab gave me access to state-of-the-art GPU nodes and collaboration that you can't find in a standard classroom.",
            name: "Rahul S.",
            role: "AI Research Lead",
            initials: "RS",
        },
        {
            text: "HiveMind represents the peak of student innovation at Sathyabama. The projects developed here show that with the right mentorship and computing power, students can tackle complex, real-world problems.",
            name: "Dr. Anitha P.",
            role: "Faculty Mentor",
            initials: "AP",
        },
        {
            text: "The hands-on experience in MLOps pipelines and large language model architectures I gained at HiveMind was the primary reason I landed my job as an ML Engineer right after graduation.",
            name: "Priya K.",
            role: "Alumni / ML Engineer",
            initials: "PK",
        },
    ];

    const tripledTestimonials = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10 overflow-hidden" id="testimonials">
            <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                Community Voices
            </h2>

            {/* Infinite Marquee Wrapper */}
            <div className="relative w-full max-w-7xl overflow-hidden py-4 mask-marquee">
                <div className="flex animate-marquee gap-8 hover:[animation-play-state:paused] cursor-pointer">
                    {tripledTestimonials.map((t, index) => (
                        <div
                            key={index}
                            className="relative w-[320px] md:w-[420px] flex-shrink-0 bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-gold-primary/20 hover:bg-white/[0.04]"
                        >
                            <div className="absolute top-4 right-6 text-4xl text-gold-primary/10 font-serif select-none pointer-events-none">“</div>
                            <p className="relative z-10 text-xs md:text-sm text-[#DDDDDD] leading-relaxed italic mb-6">{t.text}</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(255,193,7,0.2)]">
                                    {t.initials}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs md:text-sm font-bold text-white">{t.name}</span>
                                    <span className="text-[10px] text-[#888888] mt-0.5">{t.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ==========================================
// JOIN SECTION COMPONENT
// ==========================================
function JoinSection() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [domain, setDomain] = useState("");
    const [year, setYear] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (name && email && domain && year) {
            setSubmitted(true);
        }
    };

    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="join">
            <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                Apply Now
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                Join HiveMind
            </h2>

            <div className="relative w-full max-w-3xl bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.01] border border-white/5 rounded-3xl p-6 sm:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[150%] before:h-[150%] before:bg-[radial-gradient(circle,rgba(255,193,7,0.04)_0%,transparent_60%)] before:pointer-events-none before:z-[1]">
                <div className="relative z-10 max-w-xl mx-auto">
                    {submitted ? (
                        <div className="py-8">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FFC107"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mx-auto mb-6"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <h3 className="text-2xl font-bold mb-4 text-white">
                                Application Submitted!
                            </h3>
                            <p className="text-[#A0A0A0] leading-relaxed">
                                Thank you for applying to HiveMind, {name}. Our team will review your application and get in touch with you at <strong>{email}</strong> regarding the interview schedule in the SCAS AI Supercomputing Lab.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-base text-[#BBBBBB] leading-relaxed mb-12">
                                Ready to push the boundaries of Artificial Intelligence? Apply now to join our community of developers, builders, and researchers operating from the Sathyabama AI Supercomputing Laboratory.
                            </p>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left mb-8" onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider" htmlFor="user-name">
                                        Full Name
                                    </label>
                                    <input
                                        className="bg-white/[0.02] border border-white/10 rounded-lg py-3 px-4 text-white text-sm transition-all duration-300 focus:outline-none focus:border-gold-primary focus:bg-gold-primary/[0.01] focus:shadow-[0_0_10px_rgba(255,193,7,0.15)]"
                                        type="text"
                                        id="user-name"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider" htmlFor="user-email">
                                        Email Address
                                    </label>
                                    <input
                                        className="bg-white/[0.02] border border-white/10 rounded-lg py-3 px-4 text-white text-sm transition-all duration-300 focus:outline-none focus:border-gold-primary focus:bg-gold-primary/[0.01] focus:shadow-[0_0_10px_rgba(255,193,7,0.15)]"
                                        type="email"
                                        id="user-email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider" htmlFor="user-domain">
                                        Domain of Interest
                                    </label>
                                    <select
                                        className="bg-white/[0.02] border border-white/10 rounded-lg py-3 px-4 text-white text-sm transition-all duration-300 focus:outline-none focus:border-gold-primary focus:bg-gold-primary/[0.01] focus:shadow-[0_0_10px_rgba(255,193,7,0.15)] form-select-icon pr-10"
                                        id="user-domain"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select a domain
                                        </option>
                                        <option value="Generative AI & LLMs">Generative AI & LLMs</option>
                                        <option value="RAG & AI Agents">RAG & AI Agents</option>
                                        <option value="Deep Learning & Transformers">Deep Learning & Transformers</option>
                                        <option value="Computer Vision">Computer Vision</option>
                                        <option value="MLOps & Infrastructure">MLOps & Infrastructure</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider" htmlFor="user-year">
                                        Year of Study
                                    </label>
                                    <select
                                        className="bg-white/[0.02] border border-white/10 rounded-lg py-3 px-4 text-white text-sm transition-all duration-300 focus:outline-none focus:border-gold-primary focus:bg-gold-primary/[0.01] focus:shadow-[0_0_10px_rgba(255,193,7,0.15)] form-select-icon pr-10"
                                        id="user-year"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select year
                                        </option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2 text-center items-center">
                                    <button className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-3.5 px-10 text-sm font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_8px_25px_rgba(255,193,7,0.3)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_12px_30px_rgba(255,193,7,0.5)] active:translate-y-0 active:shadow-[0_4px_15px_rgba(255,193,7,0.3)] mt-6" type="submit">
                                        Apply to Join
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

// ==========================================
// PROJECTS SECTION COMPONENT
// ==========================================
function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ProjectServices.getProjects()
            .then((res) => {
                if (res.success && res.projects) {
                    setProjects(res.projects);
                }
            })
            .catch((err) => console.error("Error loading projects:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="projects">
                <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                    Explore
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                    Our Projects
                </h2>
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin" />
                    <span className="text-[10px] text-[#888888] uppercase tracking-wider font-extrabold">Loading our creations...</span>
                </div>
            </section>
        );
    }

    if (projects.length === 0) {
        return null; // Don't render empty section
    }

    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="projects">
            <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                Active Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                {projects.map((project) => (
                    <div
                        key={project._id}
                        className="group relative bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden flex flex-col h-full hover:border-gold-primary/20 hover:bg-gold-primary/[0.005] hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.02)]"
                    >
                        {/* Thumbnail cover */}
                        <div className="relative w-full h-48 overflow-hidden bg-black border-b border-white/5">
                            {project.thumbnail ? (
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 uppercase font-black text-xs">
                                    No Image
                                </div>
                            )}
                            {/* Domain label */}
                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-gold-primary text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase">
                                {project.domain}
                            </span>
                        </div>

                        {/* Card details */}
                        <div className="p-6 flex flex-col flex-1 justify-between">
                            <div className="space-y-3.5">
                                <h3 className="text-base font-black text-white uppercase tracking-wider group-hover:text-gold-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-xs text-[#BBBBBB] leading-relaxed line-clamp-3">
                                    {project.description}
                                </p>
                                
                                {/* Tech stack tags */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {project.techStack.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-white/5 border border-white/5 text-[#AAAAAA] text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Footer: Timeline & Links */}
                            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                                <span className="text-[9px] text-[#666666] uppercase tracking-widest font-black">
                                    {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - {new Date(project.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </span>

                                <div className="flex items-center gap-3">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-black text-white/80 hover:text-gold-primary uppercase tracking-widest transition-colors flex items-center gap-1 hover:underline"
                                    >
                                        GitHub
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                    {project.liveDemo && (
                                        <a
                                            href={project.liveDemo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-black text-gold-primary hover:text-gold-light uppercase tracking-widest transition-colors flex items-center gap-1 hover:underline"
                                        >
                                            Demo
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                ))}
            </div>
        </section>
    );
}

// ==========================================
// HOME PAGE CONTAINER
// ==========================================
export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <AboutSection />
                <MissionSection />
                <DomainsSection />
                <ProjectsSection />
                <TestimonialsSection />
                <JoinSection />
            </main>
        </>
    );
}


