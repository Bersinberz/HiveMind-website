import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import Toast from "../../compoenets/Toast";
import ProjectServices, { type Project } from "../../services/admin/ProjectServices";
import axiosInstance from "../../services/axiosInstance";

export default function ProjectsManagement() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Toast Alert State ---
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

    // --- Projects State ---
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [editingProjectId, setEditingProjectId] = useState("");

    // Image Cropper State (16:9 Widescreen Aspect Ratio)
    const [isCropping, setIsCropping] = useState(false);
    const [cropSrc, setCropSrc] = useState("");
    const [zoom, setZoom] = useState(1.2);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Cloudinary Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Deletion Modal State
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const [formValues, setFormValues] = useState({
        title: "",
        description: "",
        domain: "",
        techStack: "", // Comma-separated in UI, parsed to array on submit
        github: "",
        liveDemo: "",
        thumbnail: "",
        startDate: "",
        endDate: "",
    });

    const handleCropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleCropMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setOffsetX(prev => prev + dx);
        setOffsetY(prev => prev + dy);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleCropMouseUp = () => {
        setIsDragging(false);
    };

    const handleCropTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleCropTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - dragStart.x;
        const dy = touch.clientY - dragStart.y;
        setOffsetX(prev => prev + dx);
        setOffsetY(prev => prev + dy);
        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
            const res = await ProjectServices.getProjects();
            if (res.success && res.projects) {
                setProjects(res.projects);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
            setToast({ message: "Failed to fetch projects list.", type: "error" });
        } finally {
            setLoadingProjects(false);
        }
    };

    useEffect(() => {
        // Authenticate admin based on HttpOnly cookie session
        authService
            .getAdminStatus()
            .then((data) => {
                if (data.success && data.admin) {
                    setAdmin(data.admin);
                    setLoading(false);
                    fetchProjects();
                } else {
                    navigate("/admin/login");
                }
            })
            .catch(() => {
                navigate("/admin/login");
            });
    }, [navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setToast({ message: "Image file too large (Max 5MB).", type: "error" });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setCropSrc(reader.result as string);
                    setZoom(1.2);
                    setOffsetX(0);
                    setOffsetY(0);
                    setIsCropping(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelCrop = () => {
        setIsCropping(false);
        setCropSrc("");
    };

    const deleteImageFromCloudinary = async (url: string) => {
        if (!url || !url.includes("res.cloudinary.com")) return;
        try {
            await axiosInstance.post("/v1/admin/cloudinary/delete", { url });
        } catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
        }
    };

    const openAddModal = () => {
        setModalMode("add");
        setEditingProjectId("");
        setIsCropping(false);
        setCropSrc("");
        setFormValues({
            title: "",
            description: "",
            domain: "",
            techStack: "",
            github: "",
            liveDemo: "",
            thumbnail: "",
            startDate: "",
            endDate: "",
        });
        setIsModalOpen(true);
    };

    const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().split("T")[0];
    };

    const openEditModal = (project: Project) => {
        setModalMode("edit");
        setEditingProjectId(project._id);
        setIsCropping(false);
        setCropSrc("");
        setFormValues({
            title: project.title,
            description: project.description,
            domain: project.domain,
            techStack: project.techStack.join(", "),
            github: project.github,
            liveDemo: project.liveDemo || "",
            thumbnail: project.thumbnail || "",
            startDate: formatDateForInput(project.startDate),
            endDate: formatDateForInput(project.endDate),
        });
        setIsModalOpen(true);
    };

    const renderCropperWorkspace = () => {
        const handleApplyCrop = () => {
            const img = new Image();
            img.src = cropSrc;
            img.onload = async () => {
                const canvas = document.createElement("canvas");
                // 16:9 Widescreen target resolution
                canvas.width = 640;
                canvas.height = 360;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.fillStyle = "#0c0c0e";
                ctx.fillRect(0, 0, 640, 360);

                const wOrig = img.naturalWidth;
                const hOrig = img.naturalHeight;

                const scaleCover = Math.max(640 / wOrig, 360 / hOrig);
                const wBase = wOrig * scaleCover;
                const hBase = hOrig * scaleCover;

                const wZoom = wBase * zoom;
                const hZoom = hBase * zoom;

                const x0 = (640 - wZoom) / 2;
                const y0 = (360 - hZoom) / 2;

                const canvasOffsetX = offsetX * (640 / 280);
                const canvasOffsetY = offsetY * (360 / 157.5);

                ctx.drawImage(img, x0 + canvasOffsetX, y0 + canvasOffsetY, wZoom, hZoom);

                const base64 = canvas.toDataURL("image/jpeg", 0.85);

                // Close cropper workspace & trigger Cloudinary upload
                setIsCropping(false);
                setCropSrc("");
                setIsDragging(false);
                setIsUploading(true);
                setUploadProgress(0);

                try {
                    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "n348amus";
                    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "hivemind_preset";

                    const formData = new FormData();
                    formData.append("file", base64);
                    formData.append("upload_preset", UPLOAD_PRESET);
                    formData.append("folder", "Projects");

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
                        const oldThumbnail = formValues.thumbnail;
                        setFormValues(prev => ({ ...prev, thumbnail: res.data.secure_url }));
                        if (oldThumbnail) {
                            deleteImageFromCloudinary(oldThumbnail);
                        }
                        setToast({ message: "Thumbnail uploaded successfully.", type: "success" });
                    } else {
                        setToast({ message: "Upload failed: No secure URL returned.", type: "error" });
                    }
                } catch (err: any) {
                    console.error("Cloudinary upload error:", err);
                    setToast({
                        message: err.response?.data?.error?.message || "Cloudinary upload failed.",
                        type: "error"
                    });
                } finally {
                    setIsUploading(false);
                    setUploadProgress(0);
                }
            };
        };

        return (
            <div className="flex flex-col items-center w-full">
                <h3 className="text-base font-black uppercase tracking-wider text-white mb-2 w-full text-left">
                    Crop Project Thumbnail
                </h3>
                <p className="text-[10px] text-[#888888] mb-6 w-full text-left uppercase tracking-wider font-semibold">
                    Drag the image to position it inside the 16:9 widescreen frame.
                </p>

                {/* 16:9 Rectangular Cropping Frame */}
                <div
                    onMouseDown={handleCropMouseDown}
                    onMouseMove={handleCropMouseMove}
                    onMouseUp={handleCropMouseUp}
                    onMouseLeave={handleCropMouseUp}
                    onTouchStart={handleCropTouchStart}
                    onTouchMove={handleCropTouchMove}
                    onTouchEnd={handleCropMouseUp}
                    className="relative bg-black border border-white/10 overflow-hidden flex items-center justify-center shadow-lg cursor-move select-none rounded-xl"
                    style={{
                        width: "280px",
                        height: "157.5px"
                    }}
                >
                    <img
                        src={cropSrc}
                        alt="Crop Preview"
                        className="max-w-none origin-center pointer-events-none select-none"
                        style={{
                            transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                            transition: "none",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                    <div className="absolute inset-0 border border-gold-primary/20 pointer-events-none" />
                </div>

                {/* Sliders */}
                <div className="w-full mt-8">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">
                            <span>Zoom</span>
                            <span className="text-gold-primary">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            className="w-full accent-gold-primary h-1 bg-white/10 rounded-lg cursor-pointer"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 w-full mt-6 border-t border-white/5">
                    <button
                        type="button"
                        onClick={handleCancelCrop}
                        className="bg-transparent border border-white/10 hover:border-white/20 text-white text-xs font-bold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleApplyCrop}
                        className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black text-xs font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)]"
                    >
                        Save Crop
                    </button>
                </div>
            </div>
        );
    };

    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate basic fields
        if (formValues.title.trim().length < 3) {
            setToast({ message: "Project title must be at least 3 characters.", type: "error" });
            return;
        }
        if (formValues.description.trim().length < 10) {
            setToast({ message: "Project description must be at least 10 characters.", type: "error" });
            return;
        }
        if (!formValues.techStack.trim()) {
            setToast({ message: "Please provide at least one technology stack item.", type: "error" });
            return;
        }
        if (!formValues.thumbnail) {
            setToast({ message: "A project thumbnail is required.", type: "error" });
            return;
        }
        if (!formValues.startDate || !formValues.endDate) {
            setToast({ message: "Start and End dates are required.", type: "error" });
            return;
        }
        if (new Date(formValues.startDate) > new Date(formValues.endDate)) {
            setToast({ message: "Start date cannot be after end date.", type: "error" });
            return;
        }

        // Tech stack array parsing
        const parsedTech = formValues.techStack.split(",").map(t => t.trim()).filter(Boolean);

        const projectPayload = {
            ...formValues,
            techStack: parsedTech,
        };

        try {
            if (modalMode === "add") {
                const res = await ProjectServices.createProject(projectPayload);
                if (res.success) {
                    setIsModalOpen(false);
                    setToast({ message: "Project created successfully.", type: "success" });
                    fetchProjects();
                } else {
                    setToast({ message: res.message || "Failed to create project.", type: "error" });
                }
            } else {
                const res = await ProjectServices.updateProject(editingProjectId, projectPayload);
                if (res.success) {
                    setIsModalOpen(false);
                    setToast({ message: "Project updated successfully.", type: "success" });
                    fetchProjects();
                } else {
                    setToast({ message: res.message || "Failed to update project.", type: "error" });
                }
            }
        } catch (err: any) {
            console.error("Modal Submit Error:", err);
            setToast({
                message: err.response?.data?.message || "An error occurred while saving.",
                type: "error"
            });
        }
    };

    const executeDeleteProject = async (id: string) => {
        try {
            const res = await ProjectServices.deleteProject(id);
            if (res.success) {
                setToast({ message: "Project deleted successfully.", type: "success" });
                fetchProjects();
            } else {
                setToast({ message: res.message || "Failed to delete project.", type: "error" });
            }
        } catch (err: any) {
            console.error("Delete Error:", err);
            setToast({
                message: err.response?.data?.message || "An error occurred while deleting.",
                type: "error"
            });
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate("/admin/login");
        } catch (error) {
            console.error("Logout failed:", error);
            navigate("/admin/login");
        }
    };

    if (loading) {
        return <AdminLoader />;
    }

    const navigationItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                </svg>
            ),
        },
        {
            id: "team",
            label: "Team management",
            path: "/admin/team",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            id: "projects",
            label: "Projects",
            path: "/admin/projects",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            ),
        },

        {
            id: "new_members",
            label: "new members",
            path: "/admin/new-members",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="16" y1="11" x2="22" y2="11" />
                </svg>
            ),
        },

    ];

    const domains = Array.from(new Set(projects.map(p => p.domain))).filter(Boolean);

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDomain = !selectedDomain || p.domain === selectedDomain;

        return matchesSearch && matchesDomain;
    });

    return (
        <div className="min-h-screen bg-[#050505] flex text-white relative">
            {/* Custom Toast Alert Component */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SIDEBAR */}
            <aside className="hidden lg:flex flex-col justify-between w-64 bg-white/[0.02] border-r border-white/5 p-6 z-10 select-none flex-shrink-0">
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/HiveMind-Logo.png"
                            alt="HiveMind Logo"
                            className="h-10 w-auto filter drop-shadow-[0_0_8px_rgba(255,193,7,0.3)]"
                        />
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gold-sweep">
                                HiveMind Admin
                            </h2>
                            <span className="text-[8px] text-[#666666] tracking-widest uppercase block">
                                Control Center
                            </span>
                        </div>
                    </div>

                    <nav className="space-y-1.5">
                        {navigationItems.map((item) => {
                            const isActive = item.id === "projects";
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${isActive
                                            ? "bg-gold-primary/10 border border-gold-primary/20 text-gold-primary [text-shadow:0_0_10px_rgba(255,193,7,0.25)] shadow-[0_4px_15px_rgba(255,193,7,0.05)]"
                                            : "bg-transparent border border-transparent text-[#888888] hover:text-white hover:bg-white/[0.01]"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="space-y-4 border-t border-white/5 pt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all cursor-pointer bg-transparent border-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0 z-10">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 sm:px-10 flex-shrink-0 bg-white/[0.01] backdrop-blur-xs select-none">
                    <h1 className="text-sm font-black uppercase tracking-wider text-white">
                        Admin Workspace
                    </h1>
                    <div className="w-8 h-8 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-xs font-bold text-gold-primary uppercase [text-shadow:0_0_8px_rgba(255,193,7,0.3)] shadow-[0_0_12px_rgba(255,193,7,0.05)]">
                        {admin?.name?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
                </header>

                <main className="flex-1 p-6 sm:p-10 md:p-12">
                    <div className="space-y-8 animate-text-entrance">
                        <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
                                        Projects Management
                                    </h2>
                                    <p className="text-xs text-[#888888] mt-1">
                                        Manage artificial intelligence research pipelines and student-led projects.
                                    </p>
                                </div>
                                <button
                                    onClick={openAddModal}
                                    className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-2.5 px-5 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.2)] transition-all duration-300 hover:scale-102 hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)] active:scale-100"
                                >
                                    Add Project
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                                <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                                    <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Search</label>
                                    <input
                                        type="text"
                                        placeholder="Search by title or description..."
                                        className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Domain</label>
                                    <select
                                        className="bg-[#0c0c0e] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                        value={selectedDomain}
                                        onChange={(e) => setSelectedDomain(e.target.value)}
                                    >
                                        <option value="">All Domains</option>
                                        {domains.map(dom => (
                                            <option key={dom} value={dom}>{dom}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {loadingProjects ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-3">
                                    <svg className="animate-spin h-8 w-8 text-gold-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-xs text-[#888888] uppercase tracking-wider font-bold">Loading projects...</span>
                                </div>
                            ) : filteredProjects.length === 0 ? (
                                <div className="py-20 text-center">
                                    <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">No projects found</span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-[#888888] uppercase font-bold tracking-wider">
                                                <th className="pb-3 pl-4 w-32">Thumbnail</th>
                                                <th className="pb-3 pl-2">Project Info</th>
                                                <th className="pb-3">Timeline</th>
                                                <th className="pb-3 pr-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-[#DDDDDD]">
                                            {filteredProjects.map(project => (
                                                <tr key={project._id} className="hover:bg-white/[0.01] transition-colors">
                                                    <td className="py-3.5 pl-4">
                                                        <div className="w-24 h-14 bg-black border border-white/10 overflow-hidden rounded-lg flex items-center justify-center flex-shrink-0">
                                                            {project.thumbnail ? (
                                                                <img src={project.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-[9px] text-white/30 uppercase font-bold">No Image</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 pl-2">
                                                        <div className="flex flex-col gap-1 max-w-sm">
                                                            <span className="font-extrabold text-sm text-white uppercase tracking-wider">{project.title}</span>
                                                            <span className="text-[9px] text-[#888888] uppercase tracking-widest font-black">{project.domain}</span>
                                                            <p className="text-[11px] text-[#BBBBBB] line-clamp-2">{project.description}</p>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {project.techStack.map((tech, idx) => (
                                                                    <span key={idx} className="bg-white/5 border border-white/10 text-[#CCCCCC] text-[8px] px-1.5 py-0.5 rounded font-mono font-bold">
                                                                        {tech}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-[#AAAAAA] uppercase text-[9px] tracking-wider">Duration</span>
                                                            <span className="text-[10px] text-white font-semibold">
                                                                {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - {new Date(project.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                                            </span>
                                                            <div className="flex gap-2 mt-2">
                                                                <a
                                                                    href={project.github}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[9px] font-bold text-gold-primary hover:underline uppercase tracking-wider"
                                                                >
                                                                    GitHub
                                                                </a>
                                                                {project.liveDemo && (
                                                                    <>
                                                                        <span className="text-white/10">|</span>
                                                                        <a
                                                                            href={project.liveDemo}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-[9px] font-bold text-gold-primary hover:underline uppercase tracking-wider"
                                                                        >
                                                                            Live Demo
                                                                        </a>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 pr-4 text-right">
                                                        <button
                                                            onClick={() => openEditModal(project)}
                                                            className="bg-white/5 hover:bg-white/10 text-white text-[9px] font-extrabold uppercase py-1 px-3.5 rounded-full mr-2 cursor-pointer transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setProjectToDelete(project._id)}
                                                            className="bg-transparent border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-[9px] font-bold uppercase py-1 px-3.5 rounded-full cursor-pointer transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>

            {/* Modals: Crop Upload / Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 overflow-y-auto">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative my-8 animate-text-entrance">
                        {isUploading ? (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none animate-text-entrance">
                                <div className="w-14 h-14 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin mb-6" />
                                <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                    Uploading Thumbnail
                                </h4>
                                <div className="w-full max-w-xs bg-white/5 h-1.5 rounded-full overflow-hidden mb-3">
                                    <div
                                        className="bg-gradient-to-r from-gold-primary to-gold-light h-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-bold text-gold-primary uppercase tracking-wider">
                                    {uploadProgress}% Complete
                                </span>
                            </div>
                        ) : isCropping && cropSrc ? (
                            renderCropperWorkspace()
                        ) : (
                            <>
                                <h3 className="text-lg font-black uppercase tracking-wider text-white mb-6">
                                    {modalMode === "add" ? "Add Project" : "Edit Project"}
                                </h3>

                                <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
                                    <div className="flex flex-col items-center justify-center gap-3 w-full mb-4">
                                        <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider block text-center">Project Thumbnail Cover (16:9)</label>

                                        <div
                                            className="relative w-48 h-28 p-[1.5px] bg-gradient-to-br from-gold-primary/30 to-gold-primary/80 rounded-xl"
                                        >
                                            <div
                                                className="relative w-full h-full bg-white/[0.02] overflow-hidden flex items-center justify-center rounded-[10px]"
                                            >
                                                {formValues.thumbnail ? (
                                                    <img src={formValues.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                                        <polyline points="21 15 16 10 5 21" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 justify-center w-full">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="thumbnail-upload"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="thumbnail-upload"
                                                className="bg-white/5 border border-white/10 hover:border-gold-primary/30 text-white text-[10px] font-bold uppercase py-2 px-5 rounded-lg cursor-pointer transition-colors block text-center"
                                            >
                                                Upload Thumbnail
                                            </label>
                                            {formValues.thumbnail && (
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        const urlToDelete = formValues.thumbnail;
                                                        setFormValues({ ...formValues, thumbnail: "" });
                                                        await deleteImageFromCloudinary(urlToDelete);
                                                    }}
                                                    className="text-red-400 text-[10px] font-bold uppercase hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
                                                >
                                                    Remove Thumbnail
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Project Title *</label>
                                        <input
                                            type="text"
                                            required
                                            className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                            value={formValues.title}
                                            onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Project Description *</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary resize-none"
                                            value={formValues.description}
                                            onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Domain *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Computer Vision"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.domain}
                                                onChange={(e) => setFormValues({ ...formValues, domain: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Tech Stack (comma separated) *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. React, Node.js, PyTorch"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.techStack}
                                                onChange={(e) => setFormValues({ ...formValues, techStack: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">GitHub Repository URL *</label>
                                            <input
                                                type="url"
                                                required
                                                placeholder="https://github.com/..."
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.github}
                                                onChange={(e) => setFormValues({ ...formValues, github: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Live Demo URL (optional)</label>
                                            <input
                                                type="url"
                                                placeholder="https://..."
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.liveDemo}
                                                onChange={(e) => setFormValues({ ...formValues, liveDemo: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Start Date *</label>
                                            <input
                                                type="date"
                                                required
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary scheme-dark"
                                                value={formValues.startDate}
                                                onChange={(e) => setFormValues({ ...formValues, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">End Date *</label>
                                            <input
                                                type="date"
                                                required
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary scheme-dark"
                                                value={formValues.endDate}
                                                onChange={(e) => setFormValues({ ...formValues, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="bg-transparent border border-white/10 hover:border-white/20 text-white text-xs font-bold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black text-xs font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)]"
                                        >
                                            {modalMode === "add" ? "Save Project" : "Update Project"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {projectToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
                    <div className="bg-[#0c0c0e] border border-red-500/20 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(239,68,68,0.1)] text-center relative animate-text-entrance">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>
                        
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                            Confirm Deletion
                        </h3>
                        <p className="text-xs text-[#888888] leading-relaxed mb-6 uppercase tracking-wider font-semibold">
                            Are you sure you want to delete this project? This action is permanent and cannot be undone.
                        </p>
                        
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setProjectToDelete(null)}
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const id = projectToDelete;
                                    setProjectToDelete(null);
                                    await executeDeleteProject(id);
                                }}
                                className="bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(239,68,68,0.05)]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
