import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import TeammanagemntServices, { type TeamMember } from "../../services/admin/TeammanagemntServices";
import axiosInstance from "../../services/axiosInstance";
import MasterDataServices, { type IMasterDataOption } from "../../services/admin/MasterDataServices";
import AdminSidebar from "../../compoenets/AdminSidebar";
import CustomSingleSelect from "../../compoenets/CustomSingleSelect";
import Portal from "../../compoenets/Portal";

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
    const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({});

    const toggleMemberExpand = (id: string) => {
        setExpandedMembers(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // --- Master Data Options state ---
    const [masterOptions, setMasterOptions] = useState<IMasterDataOption[]>([]);

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

    // Deletion Modal State
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const deleteImageFromCloudinary = async (url: string) => {
        if (!url || !url.includes("res.cloudinary.com")) return;
        try {
            await axiosInstance.post("/v1/admin/cloudinary/delete", { url });
        } catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
        }
    };

    const [formValues, setFormValues] = useState({
        fullname: "",
        registerNumber: "",
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

    const fetchMasterData = async () => {
        try {
            const res = await MasterDataServices.getMasterData();
            if (res.success && res.data) {
                setMasterOptions(res.data);
            }
        } catch (err) {
            console.error("Error fetching master data:", err);
        }
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
                    fetchMasterData();
                } else {
                    navigate("/admin/login");
                }
            })
            .catch(() => {
                navigate("/admin/login");
            });
    }, [navigate]);

    useEffect(() => {
        if (isModalOpen || memberToDelete) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen, memberToDelete]);

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
            registerNumber: "",
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
            registerNumber: member.registerNumber || "",
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
                        const oldPic = formValues.pic;
                        setFormValues(prev => ({ ...prev, pic: res.data.secure_url }));
                        if (oldPic) {
                            deleteImageFromCloudinary(oldPic);
                        }
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

        if (!formValues.registerNumber.trim()) {
            setModalError("Register number is required.");
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

    const executeDeleteMember = async (id: string) => {
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
    };



    const departments = masterOptions.filter(o => o.category === "department").map(o => o.value);
    const batches = masterOptions.filter(o => o.category === "batch").map(o => o.value);

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
        <div className="min-h-screen bg-[#050505] flex text-white relative admin-workspace">
            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SHARED SIDEBAR COMPONENT */}
            <AdminSidebar
                activeTab="team"
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                admin={admin}
            />

            {/* MAIN WORKSPACE */}
            <div className={`flex-1 flex flex-col min-w-0 z-10 ${isModalOpen || memberToDelete ? "overflow-hidden" : "overflow-y-auto"}`}>
                {/* Mobile Top Header */}
                <header className="lg:hidden flex justify-between items-center bg-white/[0.02] border-b border-white/5 p-4 shadow-md backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="text-white hover:text-gold-primary transition-colors focus:outline-none cursor-pointer bg-transparent border-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <h1 className="text-sm font-black uppercase tracking-widest text-gold-sweep">
                            Admin Panel
                        </h1>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center font-bold text-xs text-gold-primary">
                        {admin?.name?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
                </header>

                <main className="flex-1 p-6 sm:p-10 md:p-12">
                    {loading ? (
                        <AdminLoader isComponent={true} />
                    ) : (
                        <div className="space-y-8 animate-fade-in-up">
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

                                    <div className="flex flex-col gap-1.5 col-span-1">
                                        <CustomSingleSelect
                                            label="Department"
                                            bgClass="bg-[#0c0c0e] border border-white/10 py-2 px-3 text-xs h-[38px]"
                                            dropdownBgClass="bg-[#0c0c0e]"
                                            options={[
                                                { value: "", label: "All Departments" },
                                                ...departments.map(dept => ({ value: dept, label: dept }))
                                            ]}
                                            value={selectedDept}
                                            onChange={setSelectedDept}
                                            placeholder="All Departments"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 col-span-1">
                                        <CustomSingleSelect
                                            label="Year"
                                            bgClass="bg-[#0c0c0e] border border-white/10 py-2 px-3 text-xs h-[38px]"
                                            dropdownBgClass="bg-[#0c0c0e]"
                                            options={[
                                                { value: "", label: "All Years" },
                                                { value: "1st", label: "1st Year" },
                                                { value: "2nd", label: "2nd Year" },
                                                { value: "3rd", label: "3rd Year" },
                                                { value: "4th", label: "4th Year" }
                                            ]}
                                            value={selectedYear}
                                            onChange={setSelectedYear}
                                            placeholder="All Years"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 col-span-1">
                                        <CustomSingleSelect
                                            label="Batch"
                                            bgClass="bg-[#0c0c0e] border border-white/10 py-2 px-3 text-xs h-[38px]"
                                            dropdownBgClass="bg-[#0c0c0e]"
                                            options={[
                                                { value: "", label: "All Batches" },
                                                ...batches.map(batch => ({ value: batch, label: batch }))
                                            ]}
                                            value={selectedBatch}
                                            onChange={setSelectedBatch}
                                            placeholder="All Batches"
                                        />
                                    </div>
                                </div>

                                {loadingTeam ? (
                                    <div className="flex items-center justify-center gap-3 py-20 select-none">
                                        <svg className="animate-spin h-5 w-5 text-gold-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                    <div className="flex flex-col gap-4">
                                        {filteredMembers.map(member => {
                                            const isExpanded = !!expandedMembers[member._id];
                                            return (
                                                <div
                                                    key={member._id}
                                                    className={`bg-white/[0.01] border ${isExpanded ? "border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-white/[0.02]" : "border-white/5"
                                                        } rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:bg-white/[0.015] hover:border-white/10`}
                                                >
                                                    {/* Card Header (clickable to expand/collapse) */}
                                                    <div
                                                        onClick={() => toggleMemberExpand(member._id)}
                                                        className="flex items-center justify-between cursor-pointer select-none gap-4"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {/* Hexagonal Profile Picture with Status Dot */}
                                                            <div className="relative flex-shrink-0">
                                                                <div
                                                                    className="relative w-11 h-12 p-[1px] bg-gradient-to-br from-gold-primary/20 to-gold-primary/60 flex-shrink-0"
                                                                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                                >
                                                                    <div
                                                                        className="relative w-full h-full bg-[#0c0c0e] overflow-hidden flex items-center justify-center"
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
                                                                {/* Status Dot */}
                                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#4caf50] border-2 border-[#050505] rounded-full" />
                                                            </div>

                                                            {/* Name and Badges */}
                                                            <div className="flex flex-col gap-1 min-w-0">
                                                                <span className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                                                                    {member.fullname}
                                                                </span>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    {/* Department Badge */}
                                                                    <span className="bg-[#007bff]/20 text-[#3897ff] border border-[#007bff]/30 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                                                                        {member.department}
                                                                    </span>
                                                                    <span className="text-[#888888] text-[11px] font-medium tracking-wide">
                                                                        {member.batch}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Expand/Collapse Chevron */}
                                                        <div className="text-white/60 hover:text-white transition-colors flex-shrink-0">
                                                            {isExpanded ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="18 15 12 9 6 15" />
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="6 9 12 15 18 9" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Expanded Body Panel */}
                                                    {isExpanded && (
                                                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
                                                            <div className="flex flex-col gap-1.5">
                                                                <span className="text-[11px] text-[#666666] font-semibold tracking-wide uppercase">
                                                                    {member.year} Year • Sec {member.section} • Reg: {member.registerNumber || "N/A"} • {member.email}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    {(!member.Linkedin && !member.github) ? (
                                                                        <span className="text-[11px] text-[#777777] italic tracking-wide">
                                                                            No social links linked.
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            {member.Linkedin && (
                                                                                <a
                                                                                    href={member.Linkedin}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs text-[#888888] hover:text-gold-primary transition-colors font-semibold"
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
                                                                                    className="text-xs text-[#888888] hover:text-gold-primary transition-colors font-semibold"
                                                                                >
                                                                                    GitHub
                                                                                </a>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Action buttons */}
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openEditModal(member);
                                                                    }}
                                                                    className="border border-[#00bcd4]/30 hover:border-[#00bcd4]/60 text-[#00bcd4] bg-[#00bcd4]/5 hover:bg-[#00bcd4]/10 transition-colors px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                    </svg>
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setMemberToDelete(member._id);
                                                                    }}
                                                                    className="border border-red-500/30 hover:border-red-500/60 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-colors px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="3 6 5 6 21 6" />
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                    </svg>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </main>
            </div>

            {/* Modals: Crop Upload / Form Modal */}
            {isModalOpen && (
                <Portal>
                    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-start justify-center z-[9999] p-4 overflow-y-auto pt-10 md:pt-16">
                        <div className={`bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative my-8 animate-fade-in ${(isUploading || isCropping) ? "max-w-xl" : "max-w-3xl"
                            }`}>
                            {isUploading ? (
                                <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none animate-fade-in">
                                    <div className="w-14 h-14 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin mb-6" />
                                    <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                        Uploading Photo
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
                                        {modalMode === "add" ? "Add Team Member" : "Edit Team Member"}
                                    </h3>

                                    {modalError && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4">
                                            {modalError}
                                        </div>
                                    )}

                                    <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Left Column: Profile Picture & Social Profiles */}
                                            <div className="space-y-4">
                                                <div className="flex flex-col items-center justify-center gap-3 w-full mb-2">
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
                                                                onClick={async () => {
                                                                    const urlToDelete = formValues.pic;
                                                                    setFormValues({ ...formValues, pic: "" });
                                                                    await deleteImageFromCloudinary(urlToDelete);
                                                                }}
                                                                className="text-red-400 text-[10px] font-bold uppercase hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
                                                            >
                                                                Remove Photo
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

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

                                            {/* Right Column: Personal & Academic Details */}
                                            <div className="space-y-4">
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
                                                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Register Number *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. 211422104001"
                                                        className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                        value={formValues.registerNumber}
                                                        onChange={(e) => setFormValues({ ...formValues, registerNumber: e.target.value })}
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

                                                <div className="grid grid-cols-2 gap-4">
                                                    <CustomSingleSelect
                                                        label="Department"
                                                        required
                                                        bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-3 text-xs h-[42px]"
                                                        dropdownBgClass="bg-[#0c0c0e]"
                                                        options={masterOptions.filter(o => o.category === "department").map(o => ({ value: o.value, label: o.value }))}
                                                        value={formValues.department}
                                                        onChange={(val) => setFormValues({ ...formValues, department: val })}
                                                        placeholder="Select Department"
                                                    />
                                                    <CustomSingleSelect
                                                        label="Section"
                                                        required
                                                        bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-3 text-xs h-[42px]"
                                                        dropdownBgClass="bg-[#0c0c0e]"
                                                        options={masterOptions.filter(o => o.category === "section").map(o => ({ value: o.value, label: o.value }))}
                                                        value={formValues.section}
                                                        onChange={(val) => setFormValues({ ...formValues, section: val })}
                                                        placeholder="Select Section"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <CustomSingleSelect
                                                        label="Year"
                                                        required
                                                        bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-3 text-xs h-[42px]"
                                                        dropdownBgClass="bg-[#0c0c0e]"
                                                        options={masterOptions.filter(o => o.category === "year").map(o => ({ value: o.value, label: `${o.value} Year` }))}
                                                        value={formValues.year}
                                                        onChange={(val) => setFormValues({ ...formValues, year: val as any })}
                                                        placeholder="Select Year"
                                                    />
                                                    <CustomSingleSelect
                                                        label="Batch"
                                                        required
                                                        bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-3 text-xs h-[42px]"
                                                        dropdownBgClass="bg-[#0c0c0e]"
                                                        options={masterOptions.filter(o => o.category === "batch").map(o => ({ value: o.value, label: o.value }))}
                                                        value={formValues.batch}
                                                        onChange={(val) => setFormValues({ ...formValues, batch: val })}
                                                        placeholder="Select Batch"
                                                    />
                                                </div>
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
                </Portal>
            )}

            {/* Custom Delete Confirmation Modal */}
            {memberToDelete && (
                <Portal>
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
                        <div className="bg-[#0c0c0e] border border-red-500/20 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(239,68,68,0.1)] text-center relative animate-fade-in">
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
                                Are you sure you want to delete this team member? This action is permanent and cannot be undone.
                            </p>

                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setMemberToDelete(null)}
                                    className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        const id = memberToDelete;
                                        setMemberToDelete(null);
                                        await executeDeleteMember(id);
                                    }}
                                    className="bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(239,68,68,0.05)]"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
}
