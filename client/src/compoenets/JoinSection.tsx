import { type FormEvent, useState } from "react";

export default function JoinSection() {
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
