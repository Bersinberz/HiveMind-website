import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../compoenets/Navbar";
import Toast from "../../compoenets/Toast";
import ApplicationServices from "../../services/admin/ApplicationServices";
import axiosInstance from "../../services/axiosInstance";
import MasterDataServices, { type IMasterDataOption } from "../../services/admin/MasterDataServices";
import CommunitySettingsServices from "../../services/admin/CommunitySettingsServices";

// Honeycomb background pattern
function HoneycombPattern({ className = "opacity-[0.08]" }: { className?: string }) {
    return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="honeycomb" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                    <path d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 97 L56 81 L56 49 L28 33 L0 49 L0 81 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-white" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb)" />
        </svg>
    );
}

// Neural Network connecting lines background
function NeuralNetworkLines() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="20%" x2="25%" y2="35%" stroke="#FFC107" strokeWidth="1" />
            <line x1="25%" y1="35%" x2="20%" y2="60%" stroke="#FFC107" strokeWidth="1" />
            <line x1="20%" y1="60%" x2="45%" y2="50%" stroke="#FFC107" strokeWidth="1" />
            <line x1="45%" y1="50%" x2="60%" y2="30%" stroke="#FFC107" strokeWidth="1" />
            <line x1="60%" y1="30%" x2="80%" y2="45%" stroke="#FFC107" strokeWidth="1" />
            <line x1="80%" y1="45%" x2="90%" y2="25%" stroke="#FFC107" strokeWidth="1" />
            <line x1="45%" y1="50%" x2="35%" y2="80%" stroke="#FFC107" strokeWidth="1" />
            <line x1="60%" y1="30%" x2="70%" y2="70%" stroke="#FFC107" strokeWidth="1" />
            <line x1="70%" y1="70%" x2="85%" y2="80%" stroke="#FFC107" strokeWidth="1" />

            <circle cx="10%" cy="20%" r="3" fill="#FFC107" />
            <circle cx="25%" cy="35%" r="3" fill="#FFC107" />
            <circle cx="20%" cy="60%" r="3" fill="#FFC107" />
            <circle cx="45%" cy="50%" r="4" fill="#FFC107" />
            <circle cx="60%" cy="30%" r="4" fill="#FFC107" />
            <circle cx="80%" cy="45%" r="3" fill="#FFC107" />
            <circle cx="90%" cy="25%" r="3" fill="#FFC107" />
            <circle cx="35%" cy="80%" r="3" fill="#FFC107" />
            <circle cx="70%" cy="70%" r="3" fill="#FFC107" />
            <circle cx="85%" cy="80%" r="3" fill="#FFC107" />
        </svg>
    );
}

// Particle decorative layout
function FloatingParticles() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute w-[350px] h-[350px] bg-gold-primary/[0.03] rounded-full blur-[100px] top-[15%] left-[20%] animate-pulse" />
            <div className="absolute w-[450px] h-[450px] bg-gold-primary/[0.02] rounded-full blur-[120px] bottom-[25%] right-[15%] animate-pulse" />
            <div className="absolute w-[200px] h-[200px] bg-gold-primary/[0.015] rounded-full blur-[80px] top-[60%] left-[60%] animate-[pulse_4s_ease-in-out_infinite_1.5s]" />
        </div>
    );
}

// Reusable animated section header
function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
    return (
        <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
        >
            <motion.span
                className="text-[9px] font-bold text-gold-primary uppercase tracking-[0.3em] block mb-2"
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {eyebrow}
            </motion.span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
                {title}
            </h2>
            <motion.div
                className="mx-auto mt-4 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "180px" }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
        </motion.div>
    );
}

// FAQ Accordion Item component
function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
    return (
        <div className="border-b border-white/5 py-5">
            <button
                type="button"
                onClick={onClick}
                className="w-full flex justify-between items-center text-left focus:outline-none group cursor-pointer"
            >
                <span className="text-sm font-semibold text-white group-hover:text-gold-primary transition-colors duration-300">
                    {question}
                </span>
                <span className={`text-xs text-[#9D9D9D] transition-transform duration-300 ${isOpen ? "rotate-45 text-gold-primary" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="text-xs text-[#9D9D9D] leading-relaxed pt-3 pr-6">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function JoinHiveMind() {
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [masterOptions, setMasterOptions] = useState<IMasterDataOption[]>([]);
    const [acceptingApplications, setAcceptingApplications] = useState(true);
    const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

    useEffect(() => {
        MasterDataServices.getMasterData()
            .then(res => {
                if (res.success && res.data) {
                    setMasterOptions(res.data);
                }
            })
            .catch(err => {
                console.error("Failed to load master data:", err);
            });

        CommunitySettingsServices.getSettings()
            .then(res => {
                if (res.success && res.settings) {
                    setAcceptingApplications(res.settings.acceptingApplications !== false);
                }
            })
            .catch(err => {
                console.error("Failed to load community settings:", err);
            });
    }, []);

    const [formValues, setFormValues] = useState({
        fullname: "",
        registerNumber: "",
        email: "",
        phoneNumber: "",
        dept: "",
        year: "1st" as "1st" | "2nd" | "3rd" | "4th",
        linkedin: "",
        github: "",
        resume: "", // PDF URL
        portfolio: "",
        domainOfInterest: "",
        programmingLanguages: "", // split into array on submit
        whyJoin: "",
        hoursPerWeek: 10,
        howDidYouHear: "",
    });

    const deleteImageFromCloudinary = async (url: string) => {
        if (!url || !url.includes("res.cloudinary.com")) return;
        try {
            await axiosInstance.post("/v1/admin/cloudinary/delete", { url });
        } catch (err) {
            console.error("Error deleting resume from Cloudinary:", err);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setToast({ message: "Please upload your resume in PDF format only.", type: "error" });
                return;
            }
            if (file.size > 8 * 1024 * 1024) {
                setToast({ message: "PDF size must be less than 8MB.", type: "error" });
                return;
            }

            setIsUploading(true);
            setUploadProgress(0);

            try {
                const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "n348amus";
                const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "hivemind_preset";

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", UPLOAD_PRESET);
                formData.append("folder", "Resumes");

                const res = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                        onUploadProgress: (progressEvent: any) => {
                            if (progressEvent.total) {
                                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                setUploadProgress(percent);
                            }
                        }
                    }
                );

                if (res.data && res.data.secure_url) {
                    const oldResume = formValues.resume;
                    setFormValues(prev => ({ ...prev, resume: res.data.secure_url }));
                    if (oldResume) {
                        deleteImageFromCloudinary(oldResume);
                    }
                    setToast({ message: "Resume uploaded successfully.", type: "success" });
                } else {
                    setToast({ message: "Upload failed: No URL returned from server.", type: "error" });
                }
            } catch (err: any) {
                console.error("Cloudinary upload error:", err);
                setToast({
                    message: err.response?.data?.error?.message || "Failed to upload resume to Cloudinary.",
                    type: "error"
                });
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
            }
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formValues.fullname.trim().length < 3) {
            setToast({ message: "Full name must be at least 3 characters.", type: "error" });
            return;
        }
        if (!formValues.linkedin.trim()) {
            setToast({ message: "LinkedIn profile is required.", type: "error" });
            return;
        }
        if (!formValues.resume) {
            setToast({ message: "Please upload your resume.", type: "error" });
            return;
        }
        if (formValues.whyJoin.trim().length < 10) {
            setToast({ message: "Please explain in detail why you want to join HiveMind.", type: "error" });
            return;
        }
        if (formValues.hoursPerWeek < 1) {
            setToast({ message: "Please contribute at least 1 hour per week.", type: "error" });
            return;
        }

        setSubmitting(true);

        const parsedLanguages = formValues.programmingLanguages
            .split(",")
            .map((lang) => lang.trim())
            .filter((lang) => lang.length > 0);

        const payload = {
            ...formValues,
            programmingLanguages: parsedLanguages,
        };

        try {
            const res = await ApplicationServices.applyMember(payload);
            if (res.success) {
                setIsSubmitted(true);
            } else {
                setToast({ message: res.message || "Failed to submit application.", type: "error" });
            }
        } catch (error: any) {
            console.error("Submission error:", error);
            setToast({
                message: error.response?.data?.message || "An error occurred while submitting your application.",
                type: "error"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleScrollToForm = () => {
        document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScrollToWhy = () => {
        document.getElementById("why-join")?.scrollIntoView({ behavior: "smooth" });
    };

    const whyJoinCards = [
        {
            title: "Real Projects",
            desc: "Build production-ready AI systems with real impact. Implement and train models directly on cluster GPU nodes.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gold-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
            ),
            illustration: (
                <svg className="absolute right-3 bottom-3 w-28 h-28 opacity-[0.03] text-white transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none" viewBox="0 0 100 100">
                    <rect x="10" y="10" width="80" height="80" rx="10" fill="none" stroke="currentColor" strokeWidth="1" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
            )
        },
        {
            title: "AI Research",
            desc: "Collaborate on cutting-edge research and emerging technologies. Co-author papers and participate in global AI conferences.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gold-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L9 21zm0 0h4.906M12 3v3.75m0 3.75H9M12 10.5h3m-6.75 1.5h7.5M3 20.25h18" />
                    <circle cx="12" cy="9" r="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            illustration: (
                <svg className="absolute right-3 bottom-3 w-28 h-28 opacity-[0.03] text-white transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
            )
        },
        {
            title: "Community",
            desc: "Grow alongside passionate developers, researchers and innovators. Work in a highly collaborative peer network.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gold-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A12.018 12.018 0 0112 21c-1.07 0-2.115-.14-3.118-.407a12.078 12.078 0 01-3.07-1.465V19.13M3 16.056a4.125 4.125 0 017.533-2.493M3 16.056c-.502.91-.786 1.957-.786 3.07v.003c0 1.113.285 2.16.786 3.07M3 16.056A4.125 4.125 0 003 19.13M12 11.25a3 3 0 100-6 3 3 0 000 6zm6.5 1.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-13 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                </svg>
            ),
            illustration: (
                <svg className="absolute right-3 bottom-3 w-28 h-28 opacity-[0.03] text-white transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none" viewBox="0 0 100 100">
                    <polygon points="50,15 85,75 15,75" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            )
        },
        {
            title: "Hackathons",
            desc: "Participate in workshops, lab meetups and national hackathons. Prototype and deploy live builds rapidly.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gold-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 00-1.125 1.125v3.375m9 0h-9m9 0V9.75M7.5 18.75V9.75m0 0A3.375 3.375 0 0110.875 6.375h2.25A3.375 3.375 0 0116.5 9.75m-9 0h9" />
                </svg>
            ),
            illustration: (
                <svg className="absolute right-3 bottom-3 w-28 h-28 opacity-[0.03] text-white transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none" viewBox="0 0 100 100">
                    <path d="M20,20 L80,80 M80,20 L20,80" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            )
        }
    ];

    const lifeTimeline = [
        { title: "Weekly Sessions", desc: "Collaborative learning circles covering advanced AI theory, model architectures, and hardware logic." },
        { title: "Hands-on Development", desc: "Coding and deploying microservices, training deep learning neural nets, and building robotics prototypes." },
        { title: "Research Meetings", desc: "Open critiques of newly published papers from top-tier AI venues like NeurIPS, CVPR, and ICRA." },
        { title: "Workshops", desc: "Practical hands-on lab meetups focusing on compute platforms, GPU acceleration, and systems programming." },
        { title: "Hackathons", desc: "Sprints to rapidly build proof-of-concept intelligence apps and compete in nationwide hackathons." },
        { title: "Project Showcase", desc: "Showcasing built models and AI solutions to mentors, research committees, and corporate advisors." }
    ];

    const selectionSteps = [
        {
            step: "Step 1",
            title: "Application Submission",
            desc: "Complete the application form and tell us about yourself, your interests and your experience.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gold-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            )
        },
        {
            step: "Step 2",
            title: "Application Review",
            desc: "Our team reviews your profile, skills and interests to understand how you can contribute to HiveMind.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gold-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            step: "Step 3",
            title: "Technical Discussion",
            desc: "A friendly technical discussion to understand your learning approach, problem-solving ability and passion for technology.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gold-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm1.94 9.876c-.055-.44-.128-.88-.22-1.314-.117-.55-.66-1.171-1.25-1.171H4.875c-.59 0-1.133.621-1.25 1.17-.092.435-.165.875-.22 1.315M16.5 9.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm1.94 9.876c-.055-.44-.128-.88-.22-1.314-.117-.55-.66-1.171-1.25-1.171h-2.205c-.59 0-1.133.621-1.25 1.17-.092.435-.165.875-.22 1.315M21.75 9.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm1.94 9.876c-.055-.44-.128-.88-.22-1.314-.117-.55-.66-1.171-1.25-1.171h-2.205c-.59 0-1.133.621-1.25 1.17-.092.435-.165.875-.22 1.315" />
                </svg>
            )
        },
        {
            step: "Step 4",
            title: "Interview Invitation",
            desc: "Shortlisted applicants receive an invitation to join the final discussion and become part of HiveMind.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gold-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            )
        }
    ];

    const faqs = [
        { question: "Who can apply to HiveMind?", answer: "Open to all students who are passionate about intelligence systems, robotics, and software engineering. We value curiosity and core dedication over predefined titles." },
        { question: "Do I need prior experience?", answer: "Prior research experience is not required. While familiarity with programming concepts (Python, C++) is highly beneficial, we look for high learning velocity and problem-solving aptitude." },
        { question: "Is there an interview?", answer: "Yes. Once your written application is reviewed, we host a friendly technical discussion. This is a conversational review of your learning methodology, passion, and past small builds." },
        { question: "How much time should I contribute?", answer: "Lab members contribute at least 10 hours per week on average. This ensures consistent progress across team sprint cycles and project deliverables." },
        { question: "Can students from any department apply?", answer: "Yes. Although most projects run in the intersection of Computing and Electronics, students from any branch who can demonstrate coding or hardware skills are highly encouraged to join." },
        { question: "How will I know my application status?", answer: "All status updates are updated directly on the admin dashboard, and candidates will receive direct communications via Email/Contact numbers once decisions are finalized." }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <Navbar />

            {/* SECTION 1: HERO */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <HoneycombPattern className="opacity-[0.1]" />
                <NeuralNetworkLines />
                <FloatingParticles />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,193,7,0.035)_0%,transparent_60%)] pointer-events-none z-0" />

                <div className="max-w-3xl z-10 flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0, y: -12, letterSpacing: "0.1em" }}
                        animate={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="text-[10px] font-bold text-gold-primary uppercase tracking-[0.4em] mb-4 [text-shadow:0_0_12px_rgba(255,193,7,0.2)]"
                    >
                        Build the intelligence boundary
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                        className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase"
                    >
                        Join HiveMind
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="text-sm sm:text-base text-[#9D9D9D] leading-relaxed mb-10 max-w-2xl"
                    >
                        Become part of an elite community building the future of Artificial Intelligence, Robotics and Intelligent Systems.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            onClick={handleScrollToForm}
                            whileHover={{ scale: 1.04, translateY: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-gold-primary hover:bg-[#D4AF37] text-[#050505] text-[11px] font-extrabold uppercase py-3.5 px-8 rounded-full cursor-pointer transition-colors duration-300 tracking-widest shadow-[0_4px_20px_rgba(255,193,7,0.25)]"
                        >
                            Apply Now
                        </motion.button>
                        <motion.button
                            onClick={handleScrollToWhy}
                            whileHover={{ scale: 1.04, translateY: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-transparent border border-white/10 hover:border-gold-primary/40 text-white text-[11px] font-extrabold uppercase py-3.5 px-8 rounded-full cursor-pointer transition-colors duration-300 tracking-widest"
                        >
                            Explore Community
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: WHY JOIN HIVEMIND (2x2 Grid) */}
            <section id="why-join" className="relative py-24 px-6 md:px-[8%] bg-[#050505] z-10 border-t border-white/5">
                <HoneycombPattern className="opacity-[0.02]" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <SectionHeader eyebrow="Capabilities & Culture" title="Why Join HiveMind" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {whyJoinCards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -6, boxShadow: "0 15px_30px rgba(255,193,7,0.06)" }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                                className="bg-white/[0.02] border border-white/5 hover:border-gold-primary/40 rounded-2xl p-8 flex flex-col justify-between h-64 relative group overflow-hidden cursor-pointer"
                            >
                                {/* Background illustration */}
                                {card.illustration}

                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-gold-primary group-hover:text-black transition-colors duration-300">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3 group-hover:text-gold-primary transition-colors duration-300">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-[#9D9D9D] leading-relaxed max-w-xs">
                                        {card.desc}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gold-primary/60 group-hover:text-gold-primary transition-colors duration-300 pt-4">
                                    <span>Explore opportunities</span>
                                    <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3: LIFE AT HIVEMIND (TIMELINE) */}
            <section className="relative py-24 px-6 md:px-[8%] bg-[#050505] z-10 border-t border-white/5">
                <HoneycombPattern className="opacity-[0.08]" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <SectionHeader eyebrow="Experiences" title="Life at HiveMind" />

                    {/* Centered vertical chronological list */}
                    <div className="flex flex-col items-center space-y-12">
                        {lifeTimeline.map((item, idx) => {
                            const isLast = idx === lifeTimeline.length - 1;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.5, delay: idx * 0.06, ease: "easeOut" }}
                                    className="flex flex-col items-center text-center w-full max-w-lg"
                                >
                                    <div className="bg-white/[0.02] border border-white/5 hover:border-gold-primary/20 rounded-2xl p-6 w-full transition-all duration-300">
                                        <h4 className="text-xs font-bold text-gold-primary uppercase tracking-wider mb-2">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-[#9D9D9D] leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Indicator Dot */}
                                    <div className="w-2.5 h-2.5 rounded-full bg-gold-primary shadow-[0_0_8px_#FFC107] my-3 z-10" />

                                    {/* Connector Arrow Down */}
                                    {!isLast && (
                                        <div className="flex flex-col items-center">
                                            <div className="w-[1px] h-12 bg-white/10" />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="text-white/20 mt-1" viewBox="0 0 16 16">
                                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                            </svg>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 4: SELECTION PROCESS (HORIZONTAL TIMELINE) */}
            <section className="relative py-24 px-6 md:px-[8%] bg-[#050505] z-10 border-t border-white/5">
                <HoneycombPattern className="opacity-[0.02]" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <SectionHeader eyebrow="Milestones" title="Selection Process" />

                    {/* Horizontal Interactive Timeline Stepper */}
                    <div className="relative max-w-4xl mx-auto py-12 px-4 overflow-x-auto select-none">
                        <div className="min-w-[600px] relative">
                            {/* Static Pipeline line background */}
                            <div className="absolute left-10 right-10 top-3 h-[1px] bg-white/10 z-0" />

                            {/* Sequential glowing pipeline line */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "90%" }}
                                viewport={{ once: false }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                className="absolute left-10 top-3 h-[1.5px] bg-gold-primary shadow-[0_0_8px_#FFC107] z-0"
                            />

                            <div className="flex justify-between items-center relative z-10">
                                {[
                                    { label: "Submit", text: "Application" },
                                    { label: "Review", text: "Evaluation" },
                                    { label: "Technical", text: "Discussion" },
                                    { label: "Interview", text: "Invitation" }
                                ].map((node, index) => (
                                    <div key={index} className="flex flex-col items-center w-24">
                                        <motion.div
                                            initial={{ scale: 0.8, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "#050505" }}
                                            whileInView={{
                                                scale: 1,
                                                borderColor: "#FFC107",
                                                backgroundColor: "#FFC107"
                                            }}
                                            viewport={{ once: false }}
                                            transition={{ duration: 0.3, delay: index * 0.4 }}
                                            className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black text-[#050505] z-10"
                                        >
                                            {index + 1}
                                        </motion.div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white mt-3 block">
                                            {node.label}
                                        </span>
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-[#9D9D9D] mt-0.5 block">
                                            {node.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        {selectionSteps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -4, boxShadow: "0 15px 35px rgba(0,0,0,0.5)" }}
                                viewport={{ once: false, amount: 0.15 }}
                                transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
                                className="bg-white/[0.02] border border-white/5 hover:border-gold-primary/30 rounded-2xl p-6 flex flex-col justify-between min-h-[220px] text-left group"
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[9px] font-black uppercase text-gold-primary tracking-wider">
                                            {step.step}
                                        </span>
                                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-gold-primary group-hover:text-black transition-all duration-300">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 group-hover:text-gold-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-[#9D9D9D] leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: FAQ */}
            <section className="relative py-24 px-6 md:px-[8%] bg-[#050505] z-10 border-t border-white/5">
                <HoneycombPattern className="opacity-[0.08]" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />

                    <motion.div
                        className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                    >
                        {faqs.map((faq, idx) => (
                            <FAQItem
                                key={idx}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openFAQIndex === idx}
                                onClick={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}
                            />
                        ))}
                    </motion.div>

                    {/* BOTTOM CTA */}
                    <motion.div
                        className="text-center mt-24 max-w-2xl mx-auto space-y-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h3 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wide">
                            Ready to Build the Future?
                        </h3>
                        <p className="text-xs sm:text-sm text-[#9D9D9D] leading-relaxed max-w-lg mx-auto">
                            Submit your profile details below to connect with us and take the first step towards joining the lab.
                        </p>
                        <motion.button
                            onClick={handleScrollToForm}
                            whileHover={{ scale: 1.04, translateY: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-gold-primary hover:bg-[#D4AF37] text-[#050505] text-[11px] font-extrabold uppercase py-3.5 px-8 rounded-full cursor-pointer transition-colors duration-300 tracking-widest shadow-[0_4px_20px_rgba(255,193,7,0.25)] inline-block mt-4"
                        >
                            Apply Now
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* PUBLIC MEMBERSHIP FORM CONTAINER */}
            <section id="application-form" className="relative py-24 px-6 md:px-[8%] bg-[#050505] z-10 border-t border-white/5">
                <HoneycombPattern className="opacity-[0.02]" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <SectionHeader eyebrow="Registration" title="Apply For Membership" />

                    <motion.div
                        className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl relative min-h-[500px]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.05 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                    >
                        {!acceptingApplications ? (
                            <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center select-none">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">
                                    Recruitment Closed
                                </h3>
                                <p className="text-xs text-[#9D9D9D] leading-relaxed mb-8 uppercase tracking-wider font-semibold">
                                    HiveMind is not accepting recruitment applications at the moment. Please check back later or contact the admin.
                                </p>
                                <a
                                    href="/"
                                    className="bg-transparent border border-white/5 hover:border-gold-primary/30 text-white text-[10px] font-extrabold uppercase py-3 px-8 rounded-full cursor-pointer transition-all no-underline tracking-widest text-center"
                                >
                                    Return Home
                                </a>
                            </div>
                        ) : isSubmitted ? (
                            <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center select-none">
                                <div className="w-16 h-16 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary mb-6 shadow-[0_0_20px_rgba(255,193,7,0.15)] animate-pulse">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">
                                    Application Received
                                </h3>
                                <p className="text-xs text-[#9D9D9D] leading-relaxed mb-8 uppercase tracking-wider font-semibold">
                                    Thank you for applying! Your details are stored securely. Our core committee will review your resume and reach out with updates.
                                </p>
                                <a
                                    href="/"
                                    className="bg-transparent border border-white/5 hover:border-gold-primary/30 text-white text-[10px] font-extrabold uppercase py-3 px-8 rounded-full cursor-pointer transition-all no-underline tracking-widest"
                                >
                                    Return Home
                                </a>
                            </div>
                        ) : isUploading ? (
                            <div className="flex flex-col items-center justify-center text-center select-none py-24">
                                <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin mb-6" />
                                <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                    Uploading Resume
                                </h4>
                                <div className="w-full max-w-xs bg-white/5 h-1.5 rounded-full overflow-hidden mb-3">
                                    <div
                                        className="bg-gradient-to-r from-gold-primary to-gold-light h-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-gold-primary uppercase tracking-wider">
                                    {uploadProgress}% Uploaded
                                </span>
                            </div>
                        ) : submitting ? (
                            <div className="flex flex-col items-center justify-center text-center select-none py-24">
                                <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin mb-6" />
                                <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                    Submitting Application
                                </h4>
                                <span className="text-[10px] text-[#9D9D9D] uppercase tracking-wider font-bold">
                                    Verifying candidate details...
                                </span>
                            </div>
                        ) : (
                            <div className="w-full">
                                <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                                    {/* Personal Info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.fullname}
                                                onChange={(e) => setFormValues({ ...formValues, fullname: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Register Number *</label>
                                            <input
                                                type="text"
                                                required
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.registerNumber}
                                                onChange={(e) => setFormValues({ ...formValues, registerNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Email Address *</label>
                                            <input
                                                type="email"
                                                required
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.email}
                                                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Phone Number *</label>
                                            <input
                                                type="tel"
                                                required
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.phoneNumber}
                                                onChange={(e) => setFormValues({ ...formValues, phoneNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Academic Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Department *</label>
                                            <select
                                                required
                                                className="bg-[#171717] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.dept}
                                                onChange={(e) => setFormValues({ ...formValues, dept: e.target.value })}
                                            >
                                                <option value="" className="bg-[#171717]">Select Department</option>
                                                {masterOptions.filter(o => o.category === "department").map(o => (
                                                    <option key={o._id} value={o.value} className="bg-[#171717]">{o.value}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Year of Study *</label>
                                            <select
                                                required
                                                className="bg-[#171717] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.year}
                                                onChange={(e) => setFormValues({ ...formValues, year: e.target.value as any })}
                                            >
                                                <option value="" className="bg-[#171717]">Select Year</option>
                                                {masterOptions.filter(o => o.category === "year").map(o => (
                                                    <option key={o._id} value={o.value} className="bg-[#171717]">{o.value} Year</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Profiles & Resume */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">LinkedIn URL *</label>
                                            <input
                                                type="url"
                                                required
                                                placeholder="https://linkedin.com/in/..."
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.linkedin}
                                                onChange={(e) => setFormValues({ ...formValues, linkedin: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">GitHub (optional)</label>
                                            <input
                                                type="url"
                                                placeholder="https://github.com/..."
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.github}
                                                onChange={(e) => setFormValues({ ...formValues, github: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Portfolio (optional)</label>
                                            <input
                                                type="url"
                                                placeholder="https://..."
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.portfolio}
                                                onChange={(e) => setFormValues({ ...formValues, portfolio: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Resume PDF *</label>
                                            {formValues.resume ? (
                                                <div className="flex items-center justify-between border border-gold-primary/20 bg-gold-primary/5 py-2.5 px-4 rounded-xl">
                                                    <span className="text-[9px] font-bold text-gold-primary uppercase tracking-wider">Uploaded</span>
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            const url = formValues.resume;
                                                            setFormValues(prev => ({ ...prev, resume: "" }));
                                                            await deleteImageFromCloudinary(url);
                                                        }}
                                                        className="text-red-400 hover:text-red-300 font-bold uppercase text-[9px] bg-transparent border-none cursor-pointer focus:outline-none"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept="application/pdf"
                                                        id="pdf-upload"
                                                        onChange={handleResumeUpload}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="pdf-upload"
                                                        className="w-full block text-center bg-white/5 border border-white/5 hover:border-gold-primary/30 rounded-xl py-3 px-4 text-white text-[10px] font-bold uppercase cursor-pointer transition-colors"
                                                    >
                                                        Upload Resume PDF
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Focus Areas */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Domain of Interest *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Computer Vision"
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.domainOfInterest}
                                                onChange={(e) => setFormValues({ ...formValues, domainOfInterest: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Programming Languages (comma-separated) *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Python, C++, Go"
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.programmingLanguages}
                                                onChange={(e) => setFormValues({ ...formValues, programmingLanguages: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Why do you want to join HiveMind? *</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors resize-none"
                                            value={formValues.whyJoin}
                                            onChange={(e) => setFormValues({ ...formValues, whyJoin: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Hours you can contribute per week *</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.hoursPerWeek}
                                                onChange={(e) => setFormValues({ ...formValues, hoursPerWeek: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">How do you know about us? *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Website, Professor, Senior"
                                                className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                                                value={formValues.howDidYouHear}
                                                onChange={(e) => setFormValues({ ...formValues, howDidYouHear: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gold-primary hover:bg-[#D4AF37] text-[#050505] text-xs font-extrabold uppercase py-4 rounded-xl cursor-pointer transition-all duration-300 tracking-widest shadow-[0_4px_20px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_25px_rgba(255,193,7,0.3)] mt-6"
                                    >
                                        Submit Application
                                    </button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <footer className="z-10 py-8 border-t border-white/5 text-center bg-[#050505] text-[10px] text-[#9D9D9D] uppercase tracking-widest font-bold">
                © {new Date().getFullYear()} HiveMind Sathyabama. All rights reserved.
            </footer>
        </div>
    );
}
