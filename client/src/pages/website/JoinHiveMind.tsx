import { useState } from "react";
import axios from "axios";
import Navbar from "../../compoenets/Navbar";
import Toast from "../../compoenets/Toast";
import NewMemberServices from "../../services/admin/NewMemberServices";
import axiosInstance from "../../services/axiosInstance";

export default function JoinHiveMind() {
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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
                        onUploadProgress: (progressEvent) => {
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

        // Standard validation
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
            .map(l => l.trim())
            .filter(Boolean);

        const payload = {
            ...formValues,
            programmingLanguages: parsedLanguages,
        };

        try {
            const res = await NewMemberServices.applyMember(payload);
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

    const perks = [
        {
            title: "Supercomputing Access",
            desc: "Access our cluster semilabs with dedicated GPU nodes to build and benchmark machine learning algorithms.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
            )
        },
        {
            title: "Peer-led Mentorship",
            desc: "Work closely alongside faculty advisers, alumni, and senior lab researchers to refine your designs.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        },
        {
            title: "Real-world Research",
            desc: "Translate theories into software projects. Publish and co-author papers in reputable venues.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Background Atmosphere */}
            <div className="absolute top-[10%] left-[-15%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.015)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[10%] right-[-15%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.015)_0%,transparent_70%)] pointer-events-none z-0" />

            <Navbar />

            <main className="flex-1 z-10 pt-28 pb-16 px-6 md:px-[8%] flex flex-col items-center">
                <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch my-8 animate-text-entrance">
                    
                    {/* Left Column: Why Join */}
                    <div className="flex-1 flex flex-col justify-center space-y-8">
                        <div>
                            <span className="text-[10px] font-bold text-gold-primary uppercase tracking-[0.35em] mb-2.5 [text-shadow:0_0_10px_rgba(255,193,7,0.3)] block">
                                Join our mission
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                                Become a part of HiveMind
                            </h2>
                            <p className="text-sm text-[#888888] leading-relaxed mt-4">
                                HiveMind is an advanced Artificial Intelligence and Supercomputing Research Lab. We bring together dedicated researchers, software engineers, and scholars to build next-generation model infrastructures.
                            </p>
                        </div>

                        {/* Perks Section */}
                        <div className="space-y-6">
                            {perks.map((perk, idx) => (
                                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-gold-primary/10 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-gold-primary/5 border border-gold-primary/15 flex items-center justify-center flex-shrink-0">
                                        {perk.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold uppercase tracking-wide text-white mb-1">
                                            {perk.title}
                                        </h4>
                                        <p className="text-xs text-[#888888] leading-relaxed">
                                            {perk.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Dynamic submission state or registration form */}
                    <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center shadow-2xl relative min-h-[550px]">
                        {isSubmitted ? (
                            <div className="text-center py-12 px-4 max-w-sm flex flex-col items-center animate-text-entrance select-none">
                                <div className="w-16 h-16 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary mb-6 shadow-[0_0_20px_rgba(255,193,7,0.15)] animate-[pulseGlowBg_3s_infinite_alternate]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">
                                    Application Received
                                </h3>
                                <p className="text-xs text-[#888888] leading-relaxed mb-6 uppercase tracking-wider font-semibold">
                                    Thank you for applying! Your details are stored securely. Our core committee will review your resume and reach out with updates.
                                </p>
                                <a 
                                    href="/" 
                                    className="bg-transparent border border-white/10 hover:border-gold-primary/30 text-white text-[10px] font-extrabold uppercase py-3 px-6 rounded-full cursor-pointer transition-all no-underline tracking-widest"
                                >
                                    Return Home
                                </a>
                            </div>
                        ) : isUploading ? (
                            <div className="flex flex-col items-center justify-center text-center select-none py-20">
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
                            <div className="flex flex-col items-center justify-center text-center select-none py-20 animate-text-entrance">
                                <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin mb-6" />
                                <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                    Submitting Application
                                </h4>
                                <span className="text-[10px] text-[#666666] uppercase tracking-wider font-bold">
                                    Verifying candidate details...
                                </span>
                            </div>
                        ) : (
                            <div className="w-full">
                                <h3 className="text-lg font-black uppercase tracking-wider text-white mb-6 border-b border-white/5 pb-4">
                                    Apply For Membership
                                </h3>

                                <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[550px] overflow-y-auto pr-2 text-left">
                                    {/* Personal Info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Full Name *</label>
                                            <input 
                                                type="text" 
                                                required 
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.fullname}
                                                onChange={(e) => setFormValues({ ...formValues, fullname: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Register Number *</label>
                                            <input 
                                                type="text" 
                                                required 
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.registerNumber}
                                                onChange={(e) => setFormValues({ ...formValues, registerNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Email Address *</label>
                                            <input 
                                                type="email" 
                                                required 
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.email}
                                                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Phone Number *</label>
                                            <input 
                                                type="tel" 
                                                required 
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.phoneNumber}
                                                onChange={(e) => setFormValues({ ...formValues, phoneNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Academic Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Department *</label>
                                            <input 
                                                type="text" 
                                                required 
                                                placeholder="e.g. CSE"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.dept}
                                                onChange={(e) => setFormValues({ ...formValues, dept: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Year of Study *</label>
                                            <select 
                                                className="bg-[#0c0c0e] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.year}
                                                onChange={(e) => setFormValues({ ...formValues, year: e.target.value as any })}
                                            >
                                                <option value="1st">1st Year</option>
                                                <option value="2nd">2nd Year</option>
                                                <option value="3rd">3rd Year</option>
                                                <option value="4th">4th Year</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Profiles & Resume */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">LinkedIn URL *</label>
                                            <input 
                                                type="url" 
                                                required 
                                                placeholder="https://linkedin.com/in/..."
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.linkedin}
                                                onChange={(e) => setFormValues({ ...formValues, linkedin: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">GitHub (optional)</label>
                                            <input 
                                                type="url" 
                                                placeholder="https://github.com/..."
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.github}
                                                onChange={(e) => setFormValues({ ...formValues, github: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Portfolio (optional)</label>
                                            <input 
                                                type="url" 
                                                placeholder="https://..."
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.portfolio}
                                                onChange={(e) => setFormValues({ ...formValues, portfolio: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Resume PDF *</label>
                                            {formValues.resume ? (
                                                <div className="flex items-center justify-between border border-emerald-500/20 bg-emerald-500/5 py-1.5 px-3 rounded-lg">
                                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Uploaded</span>
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
                                                        className="w-full block text-center bg-white/5 border border-white/10 hover:border-gold-primary/30 rounded-lg py-2 px-3 text-white text-[10px] font-bold uppercase cursor-pointer transition-colors"
                                                    >
                                                        Upload Resume PDF
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Focus Areas */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Domain of Interest *</label>
                                            <input 
                                                type="text" 
                                                required 
                                                placeholder="e.g. Computer Vision"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.domainOfInterest}
                                                onChange={(e) => setFormValues({ ...formValues, domainOfInterest: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Programming Languages (comma-separated) *</label>
                                            <input 
                                                type="text" 
                                                required 
                                                placeholder="e.g. Python, C++, Go"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.programmingLanguages}
                                                onChange={(e) => setFormValues({ ...formValues, programmingLanguages: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Why do you want to join HiveMind? *</label>
                                        <textarea 
                                            required 
                                            rows={2} 
                                            className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary resize-none"
                                            value={formValues.whyJoin}
                                            onChange={(e) => setFormValues({ ...formValues, whyJoin: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">Hours you can contribute per week *</label>
                                            <input 
                                                type="number" 
                                                required 
                                                min="1"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.hoursPerWeek}
                                                onChange={(e) => setFormValues({ ...formValues, hoursPerWeek: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#AAAAAA] uppercase tracking-wider">How do you know about us? *</label>
                                            <input 
                                                type="text" 
                                                required 
                                                placeholder="e.g. Website, Professor, Senior"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.howDidYouHear}
                                                onChange={(e) => setFormValues({ ...formValues, howDidYouHear: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black text-xs font-extrabold uppercase py-3 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)] mt-6"
                                    >
                                        Submit Application
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="z-10 py-8 border-t border-white/5 text-center bg-[#050505] text-[10px] text-[#666666] uppercase tracking-widest font-bold">
                © {new Date().getFullYear()} HiveMind Sathyabama. All rights reserved.
            </footer>
        </div>
    );
}
