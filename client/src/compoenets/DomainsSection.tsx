export default function DomainsSection() {
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
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="projects">
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
