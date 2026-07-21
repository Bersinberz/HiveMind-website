import Domain from "../models/Domain";
import Technology from "../models/Technology";
import Project from "../models/Project";
import { slugify } from "./slugify";
 
const escapeRegex = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

interface IDomainSeed {
    name: string;
    description: string;
    technologies: string[];
}

const DOMAINS_SEED_DATA: IDomainSeed[] = [
    {
        name: "API & Microservices Development",
        description: "Designing and building scalable backend APIs, RESTful services, GraphQL, and microservice architectures.",
        technologies: [
            "REST API", "GraphQL", "gRPC", "WebSockets", "FastAPI", "Flask", 
            "Django REST Framework", "Express.js", "NestJS", "Spring Boot", 
            "ASP.NET Core", "Node.js", "Apache Kafka", "RabbitMQ", "Redis", 
            "NGINX", "Swagger / OpenAPI", "Postman"
        ]
    },
    {
        name: "Agentic AI & AI Agents",
        description: "Autonomous reasoning systems, agent frameworks, tool-use execution, and multi-agent coordination.",
        technologies: [
            "LangChain", "LangGraph", "LlamaIndex", "CrewAI", "AutoGen", 
            "Semantic Kernel", "PydanticAI", "OpenAI Agents SDK", 
            "MCP (Model Context Protocol)", "RAG", "ChromaDB", "Pinecone", 
            "Weaviate", "FAISS", "Qdrant", "Ollama", "vLLM"
        ]
    },
    {
        name: "Artificial Intelligence",
        description: "Core intelligence methodologies, heuristics, planning systems, and generic AI paradigms.",
        technologies: [
            "Python", "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "JAX", 
            "Hugging Face Transformers", "OpenCV", "NumPy", "Pandas", "SciPy", 
            "ONNX", "MLflow", "Jupyter Notebook"
        ]
    },
    {
        name: "Backend Engineering",
        description: "Server logic, database modeling, memory caching, queuing systems, security, and high performance architecture.",
        technologies: [
            "Node.js", "Express.js", "NestJS", "Python", "FastAPI", "Flask", 
            "Django", "Java", "Spring Boot", "Go", "ASP.NET Core", "MongoDB", 
            "PostgreSQL", "MySQL", "Redis", "Firebase", "Supabase", "GraphQL", 
            "REST API", "WebSockets"
        ]
    },
    {
        name: "Cloud Computing",
        description: "Deploying and managing serverless architectures, hosted storage, global CDNs, and infrastructure as code.",
        technologies: [
            "AWS", "Microsoft Azure", "Google Cloud Platform", "Docker", 
            "Kubernetes", "Terraform", "AWS Lambda", "Azure Functions", 
            "Google Cloud Functions", "Amazon EC2", "Amazon S3", "AWS ECS", 
            "AWS EKS", "Azure Kubernetes Service", "Google Kubernetes Engine", 
            "Cloudflare", "Vercel", "Netlify"
        ]
    },
    {
        name: "Computer Vision",
        description: "Extracting high-level understanding from digital images or videos, visual object detection, and segmentation.",
        technologies: [
            "OpenCV", "PyTorch", "TensorFlow", "Keras", "YOLO", "Ultralytics", 
            "Detectron2", "MMDetection", "MediaPipe", "Segment Anything (SAM)", 
            "CLIP", "Vision Transformer (ViT)", "ResNet", "CNN", "Open3D", 
            "Pillow", "Albumentations", "TensorRT", "ONNX Runtime"
        ]
    },
    {
        name: "Containerization & Orchestration",
        description: "Packaging applications into isolated environments and managing deployments across scale clusters.",
        technologies: [
            "Docker", "Docker Compose", "Kubernetes", "Helm", "Podman", 
            "containerd", "Docker Swarm", "OpenShift", "Rancher", "Minikube", 
            "K3s", "Argo CD", "Istio"
        ]
    },
    {
        name: "Deep Learning",
        description: "Training neural network architectures, backpropagation systems, gradient tuning, and GPU parallel processing.",
        technologies: [
            "PyTorch", "TensorFlow", "Keras", "JAX", "CUDA", "cuDNN", 
            "Hugging Face", "Transformers", "CNN", "RNN", "LSTM", "GRU", 
            "GAN", "Autoencoders", "Vision Transformers", "TensorBoard", 
            "PyTorch Lightning", "ONNX", "TensorRT"
        ]
    },
    {
        name: "DevOps & MLOps",
        description: "Continuous integration, automated delivery pipelines, metrics monitoring, model version control, and registry.",
        technologies: [
            "Git", "GitHub", "GitHub Actions", "GitLab CI/CD", "Jenkins", 
            "Docker", "Kubernetes", "Terraform", "Ansible", "Argo CD", 
            "Prometheus", "Grafana", "ELK Stack", "MLflow", "Kubeflow", 
            "DVC", "Weights & Biases", "Airflow", "BentoML", "Ray", 
            "Seldon Core"
        ]
    },
    {
        name: "Full-Stack Development",
        description: "End-to-end web building, linking clean reactive user interfaces to scalable data endpoints.",
        technologies: [
            "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", 
            "Vue.js", "Angular", "Tailwind CSS", "Node.js", "Express.js", 
            "NestJS", "FastAPI", "Django", "Spring Boot", "MongoDB", 
            "PostgreSQL", "MySQL", "Redis", "Firebase", "Supabase", 
            "REST API", "GraphQL", "WebSockets"
        ]
    },
    {
        name: "Generative AI",
        description: "Creating models to synthesize text, images, sounds, or 3D environments from prompt inputs.",
        technologies: [
            "OpenAI API", "Gemini API", "Anthropic API", "Hugging Face", 
            "Transformers", "Diffusers", "Stable Diffusion", "ComfyUI", 
            "Ollama", "vLLM", "PyTorch", "TensorFlow", "LangChain", 
            "LlamaIndex", "RAG", "LoRA", "QLoRA", "PEFT", "RLHF", "DPO"
        ]
    },
    {
        name: "Large Language Models (LLMs)",
        description: "Fine-tuning large language models, prompt engineering, agent actions, retrieval models, and transformer layers.",
        technologies: [
            "GPT", "Gemini", "Claude", "Llama", "Mistral", "Qwen", "DeepSeek", 
            "Hugging Face Transformers", "PyTorch", "JAX", "Ollama", "vLLM", 
            "llama.cpp", "LangChain", "LlamaIndex", "RAG", "FAISS", "ChromaDB", 
            "Pinecone", "Qdrant", "LoRA", "QLoRA", "PEFT"
        ]
    },
    {
        name: "Machine Learning",
        description: "Developing models that learn patterns from datasets and make predictions, classifications, or forecasts.",
        technologies: [
            "Python", "Scikit-learn", "XGBoost", "LightGBM", "CatBoost", 
            "TensorFlow", "PyTorch", "Keras", "NumPy", "Pandas", "SciPy", 
            "Matplotlib", "MLflow", "Optuna", "DVC", "Jupyter Notebook"
        ]
    },
    {
        name: "Natural Language Processing",
        description: "Processing, parsing, translating, and generating human language textual formats.",
        technologies: [
            "NLTK", "spaCy", "Hugging Face Transformers", "PyTorch", "TensorFlow", 
            "Gensim", "Sentence Transformers", "BERT", "RoBERTa", "T5", 
            "Word2Vec", "FastText", "LangChain", "LlamaIndex"
        ]
    },
    {
        name: "Reinforcement Learning",
        description: "Markov decision processes, deep Q-learning networks, policy gradients, and actor-critic agent simulations.",
        technologies: [
            "Gymnasium", "Stable-Baselines3", "Ray RLlib", "PyTorch", "TensorFlow", 
            "JAX", "PettingZoo", "MuJoCo", "Isaac Lab", "Isaac Sim", 
            "Unity ML-Agents", "OpenAI Gym", "CleanRL"
        ]
    },
    {
        name: "Robotics & Autonomous Systems",
        description: "Autonomous movement planning, state estimation, robotic kinematic dynamics, SLAM, and sensor fusions.",
        technologies: [
            "ROS", "ROS 2", "Gazebo", "NVIDIA Isaac Sim", "Isaac Lab", 
            "MoveIt", "RViz", "OpenCV", "PCL", "Open3D", "Python", "C++", 
            "CUDA", "PyTorch", "TensorFlow", "SLAM", "Nav2", "PX4", 
            "ArduPilot", "MAVLink", "OpenVLA"
        ]
    },
    {
        name: "Simulation & Digital Twins",
        description: "Building detailed virtual systems mirroring real-world physics, dynamics, and graphics behavior.",
        technologies: [
            "NVIDIA Isaac Sim", "Omniverse", "Gazebo", "Unity", "Unreal Engine", 
            "MATLAB", "Simulink", "Ansys", "Blender", "Webots", "CARLA", 
            "MuJoCo", "ROS 2", "OpenUSD", "Open3D"
        ]
    },
    {
        name: "Vision-Language Models",
        description: "Intersection of vision and text processing, multimodal models, zero-shot visual tagging, and grounding.",
        technologies: [
            "CLIP", "BLIP", "BLIP-2", "LLaVA", "Qwen-VL", "Gemini Vision", 
            "GPT Vision", "Florence", "Hugging Face Transformers", "PyTorch", 
            "OpenCV", "Vision Transformers", "OpenVLA", "SAM", "Grounding DINO"
        ]
    },
    {
        name: "Frontend Engineering",
        description: "Building fast, interactive, and beautiful user interfaces using modern reactive frameworks and responsive design.",
        technologies: [
            "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", 
            "Vue.js", "Angular", "Vite", "Tailwind CSS", "Bootstrap", 
            "Material UI", "Framer Motion", "GSAP", "Three.js", "WebGL"
        ]
    }
];

export const seedDomainsAndTechnologies = async () => {
    try {
        console.log("Seeding and updating Master Data: Domains and Technologies...");

        // Map standard seed data
        for (const data of DOMAINS_SEED_DATA) {
            const techIds: string[] = [];

            // 1. Process technologies
            for (const techName of data.technologies) {
                const normalizedTech = techName.trim();
                const techSlug = slugify(normalizedTech);

                // Case-insensitive technology lookups
                let tech = await Technology.findOne({
                    name: { $regex: new RegExp(`^${escapeRegex(normalizedTech)}$`, "i") }
                });

                if (!tech) {
                    tech = await Technology.create({
                        name: normalizedTech,
                        slug: techSlug,
                        description: `Default technology: ${normalizedTech}`,
                        domains: [],
                        isActive: true,
                        sortOrder: 0
                    });
                }
                techIds.push(tech._id.toString());
            }

            // 2. Process domain
            const normalizedDomain = data.name.trim();
            const domainSlug = slugify(normalizedDomain);

            let domain = await Domain.findOne({
                name: { $regex: new RegExp(`^${escapeRegex(normalizedDomain)}$`, "i") }
            });

            if (!domain) {
                domain = await Domain.create({
                    name: normalizedDomain,
                    slug: domainSlug,
                    description: data.description,
                    technologies: techIds,
                    isActive: true,
                    sortOrder: 0
                });
            } else {
                // Keep domain technologies up to date with seed data
                for (const tId of techIds) {
                    if (!domain.technologies.includes(tId as any)) {
                        domain.technologies.push(tId as any);
                    }
                }
                await domain.save();
            }

            // 3. Associate technologies to this domain
            await Technology.updateMany(
                { _id: { $in: techIds } },
                { $addToSet: { domains: domain._id } }
            );
        }

        console.log("Seeding complete. Syncing relationships...");
        
        // 4. Migrate existing projects
        await migrateExistingProjects();

    } catch (error) {
        console.error("Seeding Master Data Error:", error);
    }
};

/**
 * Migration helper to scan projects with string arrays and populate the ObjectId reference arrays
 */
const migrateExistingProjects = async () => {
    try {
        const projects = await Project.find({
            $or: [
                { domains: { $exists: false } },
                { domains: { $size: 0 } },
                { technologies: { $exists: false } },
                { technologies: { $size: 0 } }
            ]
        });

        if (projects.length === 0) {
            return;
        }

        console.log(`Found ${projects.length} project(s) requiring ObjectId reference migration. Migrating...`);

        for (const project of projects) {
            const domainIds: any[] = [];
            const techIds: any[] = [];

            // Match domains
            if (project.domain && project.domain.length > 0) {
                for (const domName of project.domain) {
                    const dom = await Domain.findOne({
                        name: { $regex: new RegExp(`^${escapeRegex(domName.trim())}$`, "i") }
                    });
                    if (dom && !domainIds.includes(dom._id)) {
                        domainIds.push(dom._id);
                    }
                }
            }

            // Match technologies
            if (project.techStack && project.techStack.length > 0) {
                for (const techName of project.techStack) {
                    const tech = await Technology.findOne({
                        name: { $regex: new RegExp(`^${escapeRegex(techName.trim())}$`, "i") }
                    });
                    if (tech && !techIds.includes(tech._id)) {
                        techIds.push(tech._id);
                    }
                }
            }

            // Save references
            project.domains = domainIds;
            project.technologies = techIds;
            await project.save();
        }

        console.log("Existing projects migrated successfully.");
    } catch (err) {
        console.error("Project Migration Error:", err);
    }
};
