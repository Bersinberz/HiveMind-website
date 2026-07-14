import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import TeammanagemntServices, { type TeamMember } from "../../services/admin/TeammanagemntServices";

export default function TeamManagement() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Team Management State ---
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDept, setSelectedDept] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [editingMemberId, setEditingMemberId] = useState("");
    const [modalError, setModalError] = useState("");

    // Image Cropper State
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

    const [formValues, setFormValues] = useState({
        fullname: "",
        email: "",
        pic: "",
        department: "",
        section: "",
        year: "1st" as "1st" | "2nd" | "3rd" | "4th",
        Linkedin: "",
        github: "",
        batch: "",
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

    const fetchTeamMembers = async () => {
        setLoadingTeam(true);
        try {
            const res = await TeammanagemntServices.getTeamMembers();
            if (res.success && res.members) {
                setTeamMembers(res.members);
            }
        } catch (err) {
            console.error("Error fetching team:", err);
        } finally {
            setLoadingTeam(false);
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
                    fetchTeamMembers();
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
                setModalError("Image file is too large. Please select a file smaller than 5MB.");
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

    const openAddModal = () => {
        setModalMode("add");
        setEditingMemberId("");
        setModalError("");
        setIsCropping(false);
        setCropSrc("");
        setFormValues({
            fullname: "",
            email: "",
            pic: "",
            department: "",
            section: "",
            year: "1st",
            Linkedin: "",
            github: "",
            batch: "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (member: TeamMember) => {
        setModalMode("edit");
        setEditingMemberId(member._id);
        setModalError("");
        setIsCropping(false);
        setCropSrc("");
        setFormValues({
            fullname: member.fullname,
            email: member.email,
            pic: member.pic || "",
            department: member.department,
            section: member.section,
            year: member.year,
            Linkedin: member.Linkedin || "",
            github: member.github || "",
            batch: member.batch,
        });
        setIsModalOpen(true);
    };

    const renderCropperWorkspace = () => {
        const handleApplyCrop = () => {
            const img = new Image();
            img.src = cropSrc;
            img.onload = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = 320;
                canvas.height = 368;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.fillStyle = "#0c0c0e";
                ctx.fillRect(0, 0, 320, 368);

                const wOrig = img.naturalWidth;
                const hOrig = img.naturalHeight;

                const scaleCover = Math.max(320 / wOrig, 368 / hOrig);
                const wBase = wOrig * scaleCover;
                const hBase = hOrig * scaleCover;

                const wZoom = wBase * zoom;
                const hZoom = hBase * zoom;

                const x0 = (320 - wZoom) / 2;
                const y0 = (368 - hZoom) / 2;

                const canvasOffsetX = offsetX * (320 / 240);
                const canvasOffsetY = offsetY * (368 / 276);

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
                    formData.append("folder", "Team images");

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
                        setFormValues(prev => ({ ...prev, pic: res.data.secure_url }));
                    } else {
                        setModalError("Upload failed: No secure URL returned from Cloudinary.");
                    }
                } catch (err: any) {
                    console.error("Cloudinary upload error:", err);
                    setModalError(
                        err.response?.data?.error?.message ||
                        "Failed to upload image to Cloudinary. Please verify your upload preset exists."
                    );
                } finally {
                    setIsUploading(false);
                    setUploadProgress(0);
                }
            };
        };

        return (
            <div className="flex flex-col items-center">
                <h3 className="text-base font-black uppercase tracking-wider text-white mb-2 w-full text-left">
                    Crop Profile Photo
                </h3>
                <p className="text-[10px] text-[#888888] mb-6 w-full text-left uppercase tracking-wider font-semibold">
                    Drag the image to position it. Use the slider below to zoom.
                </p>

                {/* Hexagonal Cropping Frame with Drag Controls */}
                <div
                    onMouseDown={handleCropMouseDown}
                    onMouseMove={handleCropMouseMove}
                    onMouseUp={handleCropMouseUp}
                    onMouseLeave={handleCropMouseUp}
                    onTouchStart={handleCropTouchStart}
                    onTouchMove={handleCropTouchMove}
                    onTouchEnd={handleCropMouseUp}
                    className="relative bg-black border border-white/10 overflow-hidden flex items-center justify-center shadow-lg cursor-move select-none"
                    style={{
                        width: "240px",
                        height: "276px",
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
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
        setModalError("");

        if (formValues.fullname.trim().length < 3) {
            setModalError("Full name must be at least 3 characters.");
            return;
        }

        // Enforce constraint: LinkedIn or GitHub profile link must be filled out
        if (!formValues.Linkedin.trim() && !formValues.github.trim()) {
            setModalError("At least one social profile link (LinkedIn or GitHub) must be provided.");
            return;
        }

        try {
            if (modalMode === "add") {
                const res = await TeammanagemntServices.createTeamMember(formValues);
                if (res.success) {
                    setIsModalOpen(false);
                    fetchTeamMembers();
                } else {
                    setModalError(res.message || "Failed to create team member.");
                }
            } else {
                const res = await TeammanagemntServices.updateTeamMember(editingMemberId, formValues);
                if (res.success) {
                    setIsModalOpen(false);
                    fetchTeamMembers();
                } else {
                    setModalError(res.message || "Failed to update team member.");
                }
            }
        } catch (err: any) {
            console.error("Modal Submit Error:", err);
            setModalError(err.response?.data?.message || "An error occurred while saving the member.");
        }
    };

    const handleDeleteMember = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this team member?")) {
            try {
                const res = await TeammanagemntServices.deleteTeamMember(id);
                if (res.success) {
                    fetchTeamMembers();
                } else {
                    alert(res.message || "Failed to delete team member.");
                }
            } catch (err) {
                console.error("Delete Error:", err);
                alert("An error occurred while deleting.");
            }
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
            path: "/admin/dashboard?tab=projects",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            ),
        },
        {
            id: "events",
            label: "Events",
            path: "/admin/dashboard?tab=events",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ),
        },
        {
            id: "new_members",
            label: "new members",
            path: "/admin/dashboard?tab=new_members",
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

    const departments = Array.from(new Set(teamMembers.map(m => m.department))).filter(Boolean);
    const batches = Array.from(new Set(teamMembers.map(m => m.batch))).filter(Boolean);

    const filteredMembers = teamMembers.filter(m => {
        const matchesSearch =
            m.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = !selectedDept || m.department === selectedDept;
        const matchesYear = !selectedYear || m.year === selectedYear;
        const matchesBatch = !selectedBatch || m.batch === selectedBatch;

        return matchesSearch && matchesDept && matchesYear && matchesBatch;
    });

    return (
        <div className="min-h-screen bg-[#050505] flex text-white relative">
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
                            const isActive = item.id === "team";
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
                                        Team Management
                                    </h2>
                                    <p className="text-xs text-[#888888] mt-1">
                                        Manage SCAS AI Supercomputing Lab researchers, leads, and mentors.
                                    </p>
                                </div>
                                <button
                                    onClick={openAddModal}
                                    className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-2.5 px-5 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.2)] transition-all duration-300 hover:scale-102 hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)] active:scale-100"
                                >
                                    Add Member
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                                <div className="flex flex-col gap-1.5 col-span-1">
                                    <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Search</label>
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Department</label>
                                    <select
                                        className="bg-[#0c0c0e] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                        value={selectedDept}
                                        onChange={(e) => setSelectedDept(e.target.value)}
                                    >
                                        <option value="">All Departments</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Year</label>
                                    <select
                                        className="bg-[#0c0c0e] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        <option value="">All Years</option>
                                        <option value="1st">1st Year</option>
                                        <option value="2nd">2nd Year</option>
                                        <option value="3rd">3rd Year</option>
                                        <option value="4th">4th Year</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Batch</label>
                                    <select
                                        className="bg-[#0c0c0e] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                        value={selectedBatch}
                                        onChange={(e) => setSelectedBatch(e.target.value)}
                                    >
                                        <option value="">All Batches</option>
                                        {batches.map(batch => (
                                            <option key={batch} value={batch}>{batch}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {loadingTeam ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-3">
                                    <svg className="animate-spin h-8 w-8 text-gold-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-xs text-[#888888] uppercase tracking-wider font-bold">Loading members...</span>
                                </div>
                            ) : filteredMembers.length === 0 ? (
                                <div className="py-20 text-center">
                                    <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">No team members found</span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-[#888888] uppercase font-bold tracking-wider">
                                                <th className="pb-3 pl-4">Member</th>
                                                <th className="pb-3">Details</th>
                                                <th className="pb-3">Social Profiles</th>
                                                <th className="pb-3 pr-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-[#DDDDDD]">
                                            {filteredMembers.map(member => (
                                                <tr key={member._id} className="hover:bg-white/[0.01] transition-colors">
                                                    <td className="py-3.5 pl-4 font-bold text-white flex items-center gap-3">
                                                        <div
                                                            className="relative w-10 h-12 p-[1px] bg-gradient-to-br from-gold-primary/20 to-gold-primary/60 flex-shrink-0"
                                                            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                        >
                                                            <div
                                                                className="relative w-full h-full bg-white/[0.02] overflow-hidden flex items-center justify-center"
                                                                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                            >
                                                                {member.pic ? (
                                                                    <img src={member.pic} alt="Profile" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-wider">
                                                                        {member.fullname.substring(0, 2)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>{member.fullname}</span>
                                                            <span className="text-[10px] text-[#666666] font-normal font-sans">{member.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-[#AAAAAA] uppercase text-[10px] tracking-wider">{member.department}</span>
                                                            <span className="text-[9px] text-[#666666] uppercase tracking-wider font-semibold">
                                                                {member.year} Year • Sec {member.section} • Batch {member.batch}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5">
                                                        <div className="flex items-center gap-2">
                                                            {member.Linkedin && (
                                                                <a
                                                                    href={member.Linkedin}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-[#888888] hover:text-gold-primary transition-colors"
                                                                >
                                                                    LinkedIn
                                                                </a>
                                                            )}
                                                            {member.Linkedin && member.github && (
                                                                <span className="text-white/10">•</span>
                                                            )}
                                                            {member.github && (
                                                                <a
                                                                    href={member.github}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-[#888888] hover:text-gold-primary transition-colors"
                                                                >
                                                                    GitHub
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 pr-4 text-right">
                                                        <button
                                                            onClick={() => openEditModal(member)}
                                                            className="bg-white/5 hover:bg-white/10 text-white text-[9px] font-extrabold uppercase py-1 px-3.5 rounded-full mr-2 cursor-pointer transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMember(member._id)}
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
                                    Uploading Photo
                                </h4>
                                <p className="text-[10px] text-[#888888] uppercase tracking-wider font-semibold mb-6">
                                    Storing image securely in Cloudinary "Team images" folder...
                                </p>
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
                                    {modalMode === "add" ? "Add Team Member" : "Edit Team Member"}
                                </h3>

                                {modalError && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4">
                                        {modalError}
                                    </div>
                                )}

                                <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
                                    <div className="flex flex-col items-center justify-center gap-3 w-full mb-4">
                                        <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider block text-center">Profile Picture</label>

                                        <div
                                            className="relative w-24 h-28 p-[1.5px] bg-gradient-to-br from-gold-primary/30 to-gold-primary/80 flex-shrink-0"
                                            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                        >
                                            <div
                                                className="relative w-full h-full bg-white/[0.02] overflow-hidden flex items-center justify-center"
                                                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                            >
                                                {formValues.pic ? (
                                                    <img src={formValues.pic} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                        <circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 justify-center w-full">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="pic-upload"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="pic-upload"
                                                className="bg-white/5 border border-white/10 hover:border-gold-primary/30 text-white text-[10px] font-bold uppercase py-2 px-5 rounded-lg cursor-pointer transition-colors block text-center"
                                            >
                                                Upload Photo
                                            </label>
                                            {formValues.pic && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormValues({ ...formValues, pic: "" })}
                                                    className="text-red-400 text-[10px] font-bold uppercase hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
                                                >
                                                    Remove Photo
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.fullname}
                                                onChange={(e) => setFormValues({ ...formValues, fullname: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Email Address *</label>
                                            <input
                                                type="email"
                                                required
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.email}
                                                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Department *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. CSE"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.department}
                                                onChange={(e) => setFormValues({ ...formValues, department: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Section *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. A"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.section}
                                                onChange={(e) => setFormValues({ ...formValues, section: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Year *</label>
                                            <select
                                                required
                                                className="bg-[#0c0c0e] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.year}
                                                onChange={(e) => setFormValues({ ...formValues, year: e.target.value as any })}
                                            >
                                                <option value="1st">1st Year</option>
                                                <option value="2nd">2nd Year</option>
                                                <option value="3rd">3rd Year</option>
                                                <option value="4th">4th Year</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Batch *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. 2023-2027"
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.batch}
                                                onChange={(e) => setFormValues({ ...formValues, batch: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">LinkedIn Profile URL</label>
                                            <input
                                                type="url"
                                                placeholder="https://linkedin.com/in/..."
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.Linkedin}
                                                onChange={(e) => setFormValues({ ...formValues, Linkedin: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">GitHub Profile URL</label>
                                            <input
                                                type="url"
                                                placeholder="https://github.com/..."
                                                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                value={formValues.github}
                                                onChange={(e) => setFormValues({ ...formValues, github: e.target.value })}
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
                                            {modalMode === "add" ? "Save Member" : "Update Member"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
