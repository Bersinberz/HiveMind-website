export default function TestimonialsSection() {
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

    // Triplicate testimonials to guarantee a seamless looping track across wide screens
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
