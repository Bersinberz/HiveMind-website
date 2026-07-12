export default function AboutSection() {
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
