export default function MissionSection() {
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
