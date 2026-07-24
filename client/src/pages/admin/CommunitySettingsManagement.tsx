import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import Toast from "../../compoenets/Toast";
import axiosInstance from "../../services/axiosInstance";
import CommunitySettingsServices, { type ITestimonial } from "../../services/admin/CommunitySettingsServices";
import AdminSidebar from "../../compoenets/AdminSidebar";
import Portal from "../../compoenets/Portal";

export default function CommunitySettingsManagement() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Community Settings states
    const [communityName, setCommunityName] = useState("");
    const [aboutCommunity, setAboutCommunity] = useState("");
    const [voices, setVoices] = useState<ITestimonial[]>([]);
    const [primaryEmail, setPrimaryEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("+91 ");
    const [tagline, setTagline] = useState("");
    const [foundedYear, setFoundedYear] = useState("");
    const [location, setLocation] = useState("");
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [acceptingApplications, setAcceptingApplications] = useState(true);

    // Navigation and sidebar mobile controls
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Testimonial modal states
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [editingVoiceIndex, setEditingVoiceIndex] = useState<number | null>(null);
    const [voiceError, setVoiceError] = useState("");

    // Form values for individual voice
    const [voiceValues, setVoiceValues] = useState({
        name: "",
        whoIsHe: "",
        description: "",
        pic: ""
    });

    // Image Cropper States
    const [isCropping, setIsCropping] = useState(false);
    const [cropSrc, setCropSrc] = useState("");
    const [zoom, setZoom] = useState(1.0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cloudinary Upload States
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Toast feedback state
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Delete confirmation state
    const [voiceToDeleteIndex, setVoiceToDeleteIndex] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteImageFromCloudinary = async (url: string) => {
        if (!url || !url.includes("res.cloudinary.com")) return;
        try {
            await axiosInstance.post("/v1/admin/cloudinary/delete", { url });
        } catch (err) {
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await CommunitySettingsServices.getSettings();
            if (res.success && res.settings) {
                setCommunityName(res.settings.communityName);
                setAboutCommunity(res.settings.aboutCommunity);
                setVoices(res.settings.communityVoices || []);
                setPrimaryEmail(res.settings.primaryEmail || "");
                setContactNumber(res.settings.contactNumber || "+91 ");
                setTagline(res.settings.tagline || "");
                setFoundedYear(res.settings.foundedYear || "");
                setLocation(res.settings.location || "");
                setGithub(res.settings.github || "");
                setLinkedin(res.settings.linkedin || "");
                setAcceptingApplications(res.settings.acceptingApplications !== false);
            }
        } catch (err) {
            setToast({ message: "Failed to load settings.", type: "error" });
        }
    };

    useEffect(() => {
        // Authenticate admin
        authService
            .getAdminStatus()
            .then((data) => {
                if (data.success && data.admin) {
                    setAdmin(data.admin);
                    setLoading(false);
                    fetchSettings();
                } else {
                    navigate("/admin/login");
                }
            })
            .catch(() => {
                navigate("/admin/login");
            });
    }, [navigate]);

    useEffect(() => {
        if (isVoiceModalOpen || voiceToDeleteIndex !== null || isCropping || saving) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isVoiceModalOpen, voiceToDeleteIndex, isCropping, saving]);


    // --- Circle Cropper Event Handlers ---
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
        if (e.cancelable) {
            e.preventDefault();
        }
        const touch = e.touches[0];
        const dx = touch.clientX - dragStart.x;
        const dy = touch.clientY - dragStart.y;
        setOffsetX(prev => prev + dx);
        setOffsetY(prev => prev + dy);
        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setCropSrc(reader.result as string);
                setZoom(1.0);
                setOffsetX(0);
                setOffsetY(0);
                setIsCropping(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelCrop = () => {
        setIsCropping(false);
        setCropSrc("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSaveCrop = () => {
        const img = new Image();
        img.src = cropSrc;
        img.onload = async () => {
            const canvas = document.createElement("canvas");
            // 3x high-resolution output (900x900) for sharp community logos/avatars
            canvas.width = 900;
            canvas.height = 900;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Draw background
            ctx.fillStyle = "#0c0c0e";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const wOrig = img.naturalWidth;
            const hOrig = img.naturalHeight;

            // Compute size to cover canvas
            const scaleCover = Math.max(canvas.width / wOrig, canvas.height / hOrig);
            const wBase = wOrig * scaleCover;
            const hBase = hOrig * scaleCover;

            const wZoom = wBase * zoom;
            const hZoom = hBase * zoom;

            // Center image
            const x0 = (canvas.width - wZoom) / 2;
            const y0 = (canvas.height - hZoom) / 2;

            // Transform offset based on crop box coordinates (240x240)
            const canvasOffsetX = offsetX * (canvas.width / 240);
            const canvasOffsetY = offsetY * (canvas.height / 240);

            ctx.drawImage(img, x0 + canvasOffsetX, y0 + canvasOffsetY, wZoom, hZoom);

            const base64 = canvas.toDataURL("image/jpeg", 0.95);

            setIsCropping(false);
            setCropSrc("");
            setIsUploading(true);
            setUploadProgress(0);

            try {
                const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "n348amus";
                const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "hivemind_preset";

                const formData = new FormData();
                formData.append("file", base64);
                formData.append("upload_preset", UPLOAD_PRESET);
                formData.append("folder", "Community Voices"); // Root folder upload requested

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
                    const oldPic = voiceValues.pic;
                    setVoiceValues(prev => ({ ...prev, pic: res.data.secure_url }));
                    if (oldPic) {
                        deleteImageFromCloudinary(oldPic);
                    }
                } else {
                    setVoiceError("Upload failed: No secure URL returned from Cloudinary.");
                }
            } catch (err: any) {
                setVoiceError(
                    err.response?.data?.error?.message ||
                    "Failed to upload image. Please verify Cloudinary credentials."
                );
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };
    };

    // --- Voice Modal CRUD Actions ---
    const openAddVoiceModal = () => {
        setModalMode("add");
        setEditingVoiceIndex(null);
        setVoiceError("");
        setVoiceValues({
            name: "",
            whoIsHe: "",
            description: "",
            pic: ""
        });
        setIsVoiceModalOpen(true);
    };

    const openEditVoiceModal = (index: number) => {
        setModalMode("edit");
        setEditingVoiceIndex(index);
        setVoiceError("");
        const selected = voices[index];
        setVoiceValues({
            name: selected.name,
            whoIsHe: selected.whoIsHe,
            description: selected.description,
            pic: selected.pic || ""
        });
        setIsVoiceModalOpen(true);
    };

    const saveVoiceForm = () => {
        if (!voiceValues.name.trim()) {
            setVoiceError("Name is required");
            return;
        }
        if (!voiceValues.whoIsHe.trim()) {
            setVoiceError("Who is he is required (e.g. AI Research Lead)");
            return;
        }
        if (!voiceValues.description.trim()) {
            setVoiceError("Description/Quote is required");
            return;
        }

        const newVoice: ITestimonial = { ...voiceValues };

        if (modalMode === "add") {
            setVoices(prev => [...prev, newVoice]);
        } else if (modalMode === "edit" && editingVoiceIndex !== null) {
            setVoices(prev => {
                const list = [...prev];
                list[editingVoiceIndex] = newVoice;
                return list;
            });
        }

        setIsVoiceModalOpen(false);
    };

    const handleConfirmDeleteVoice = (index: number) => {
        if (voices.length <= 1) {
            setToast({ message: "At least one community voice is required. You can edit this voice instead of deleting it.", type: "error" });
            return;
        }
        setVoiceToDeleteIndex(index);
    };

    const executeDeleteVoice = async () => {
        if (voiceToDeleteIndex !== null) {
            const target = voices[voiceToDeleteIndex];
            setIsDeleting(true);
            try {
                if (target.pic) {
                    await deleteImageFromCloudinary(target.pic);
                }
            } catch (err) {
            } finally {
                setVoices(prev => prev.filter((_, i) => i !== voiceToDeleteIndex));
                setVoiceToDeleteIndex(null);
                setIsDeleting(false);
            }
        }
    };

    // --- Save Main Settings ---
    const handleSaveSettings = async () => {
        if (!communityName.trim()) {
            setToast({ message: "Community Name cannot be empty.", type: "error" });
            return;
        }
        if (!aboutCommunity.trim()) {
            setToast({ message: "About Community description cannot be empty.", type: "error" });
            return;
        }

        setSaving(true);
        try {
            const res = await CommunitySettingsServices.updateSettings({
                communityName,
                aboutCommunity,
                primaryEmail,
                contactNumber,
                tagline,
                foundedYear,
                location,
                github,
                linkedin,
                acceptingApplications,
                communityVoices: voices
            });
            if (res.success) {
                setToast({ message: "Settings updated successfully!", type: "success" });
                fetchSettings();
            } else {
                setToast({ message: res.message || "Failed to update settings.", type: "error" });
            }
        } catch (err) {
            setToast({ message: "Server connection failed.", type: "error" });
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#050505] flex text-white relative admin-workspace">
            {saving && (
                <Portal>
                    <AdminLoader />
                </Portal>
            )}
            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SHARED SIDEBAR COMPONENT */}
            <AdminSidebar
                activeTab="community_settings"
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                admin={admin}
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 z-10 overflow-y-auto">
                {/* Mobile Header */}
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

                <main className="flex-1 p-6 sm:p-10 md:p-12 max-w-5xl w-full mx-auto space-y-8 animate-fade-in-up">
                    {loading ? (
                        <AdminLoader isComponent={true} />
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                                <div>
                                    <h1 className="text-2xl font-black uppercase tracking-wider text-white">
                                        Community Settings
                                    </h1>
                                    <p className="text-xs text-[#888888] mt-1">
                                        Customize the core branding, description, and client testimonial voices displayed on the public landing page.
                                    </p>
                                </div>
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={saving}
                                    className="bg-gradient-to-br from-gold-primary to-[#D4AF37] disabled:from-white/10 disabled:to-white/5 text-black disabled:text-white/40 border-none py-3 px-8 text-xs font-black tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.15)] hover:shadow-[0_4px_25px_rgba(255,193,7,0.3)] transition-all duration-300 hover:scale-102 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Settings"
                                    )}
                                </button>
                            </div>

                            {/* Settings Sections flex column stack */}
                            <div className="flex flex-col gap-8">
                                    {/* General Brand Details */}
                                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                                        <h2 className="text-sm font-black uppercase tracking-wider text-gold-primary border-b border-white/5 pb-3">
                                            General Brand details
                                        </h2>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Community Name</label>
                                            <input
                                                type="text"
                                                value={communityName}
                                                onChange={(e) => setCommunityName(e.target.value)}
                                                placeholder="Enter community name..."
                                                className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-semibold"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Tagline</label>
                                            <input
                                                type="text"
                                                value={tagline}
                                                onChange={(e) => setTagline(e.target.value)}
                                                placeholder="Enter community tagline..."
                                                className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-medium"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Founded Year</label>
                                                <input
                                                    type="text"
                                                    value={foundedYear}
                                                    onChange={(e) => setFoundedYear(e.target.value)}
                                                    placeholder="e.g. 2023"
                                                    className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-semibold"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Location</label>
                                                <input
                                                    type="text"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    placeholder="Enter lab location..."
                                                    className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-semibold"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Primary Email</label>
                                                <input
                                                    type="email"
                                                    value={primaryEmail}
                                                    onChange={(e) => setPrimaryEmail(e.target.value)}
                                                    placeholder="e.g. contact@hivemind.org"
                                                    className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-semibold"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Contact Number</label>
                                                <input
                                                    type="text"
                                                    value={contactNumber}
                                                    onChange={(e) => setContactNumber(e.target.value)}
                                                    placeholder="e.g. +91 98765 43210"
                                                    className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-semibold"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">GitHub Link</label>
                                                <input
                                                    type="url"
                                                    value={github}
                                                    onChange={(e) => setGithub(e.target.value)}
                                                    placeholder="https://github.com/..."
                                                    className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-semibold"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">LinkedIn Link</label>
                                                <input
                                                    type="url"
                                                    value={linkedin}
                                                    onChange={(e) => setLinkedin(e.target.value)}
                                                    placeholder="https://linkedin.com/company/..."
                                                    className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-semibold"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">About Community</label>
                                            <textarea
                                                value={aboutCommunity}
                                                onChange={(e) => setAboutCommunity(e.target.value)}
                                                placeholder="Write about the community..."
                                                rows={5}
                                                className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-medium leading-relaxed resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Recruitment & Application Settings Toggle */}
                                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                                        <h2 className="text-sm font-black uppercase tracking-wider text-gold-primary border-b border-white/5 pb-3">
                                            Recruitment Settings
                                        </h2>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-1 text-left">
                                                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                                                    Accepting Applications
                                                </span>
                                                <p className="text-[10px] text-[#888888] font-medium leading-normal max-w-md">
                                                    Turn application submissions ON/OFF. If turned off, users visiting the Join page will be informed that recruitment is closed.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setAcceptingApplications(!acceptingApplications)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none outline-none ${
                                                    acceptingApplications ? "bg-gold-primary" : "bg-white/10"
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                                                        acceptingApplications ? "translate-x-5" : "translate-x-0"
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Community Voices Panel */}
                                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <h2 className="text-sm font-black uppercase tracking-wider text-gold-primary">
                                            Community Voices
                                        </h2>
                                        <button
                                            onClick={openAddVoiceModal}
                                            className="bg-transparent border border-white/10 hover:border-gold-primary/30 text-gold-primary hover:text-gold-light text-[10px] font-bold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors"
                                        >
                                            + Add Voice
                                        </button>
                                    </div>

                                    {voices.length === 0 ? (
                                        <div className="py-12 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                                            <span className="text-xs text-[#666666] uppercase tracking-widest block font-bold">
                                                No community voices added yet.
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {voices.map((voice, idx) => {
                                                // Compute initials on the fly
                                                const initials = voice.name
                                                    ? voice.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                                                    : "U";
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col justify-between relative group"
                                                    >
                                                        <div className="space-y-4">
                                                            <p className="text-xs text-[#BBBBBB] leading-relaxed italic pr-8">
                                                                "{voice.description}"
                                                            </p>
                                                            <div className="flex items-center gap-3.5">
                                                                {voice.pic ? (
                                                                    <img
                                                                        src={voice.pic}
                                                                        alt={voice.name}
                                                                        className="w-10 h-10 rounded-full border border-white/10 object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(255,193,7,0.2)]">
                                                                        {initials}
                                                                    </div>
                                                                )}
                                                                <div className="flex flex-col text-left">
                                                                    <span className="text-xs font-bold text-white">{voice.name}</span>
                                                                    <span className="text-[10px] text-[#666666] font-semibold mt-0.5">{voice.whoIsHe}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => openEditVoiceModal(idx)}
                                                                className="text-white/60 hover:text-gold-primary p-1 cursor-pointer bg-transparent border-none focus:outline-none"
                                                                title="Edit Voice"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleConfirmDeleteVoice(idx)}
                                                                className="text-white/60 hover:text-red-400 p-1 cursor-pointer bg-transparent border-none focus:outline-none"
                                                                title="Delete Voice"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="3 6 5 6 21 6" />
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* MODAL: ADD / EDIT VOICE */}
            {isVoiceModalOpen && (
                <Portal>
                    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[1000] p-4 overflow-y-auto">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative my-8 animate-fade-in text-left">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                                {modalMode === "add" ? "Add Community Voice" : "Edit Community Voice"}
                            </h3>
                            <button
                                onClick={() => setIsVoiceModalOpen(false)}
                                className="text-[#888888] hover:text-white transition-colors cursor-pointer focus:outline-none bg-transparent border-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {voiceError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-4 font-semibold uppercase tracking-wider">
                                {voiceError}
                            </div>
                        )}

                        <div className="space-y-5 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Name</label>
                                    <input
                                        type="text"
                                        value={voiceValues.name}
                                        onChange={(e) => setVoiceValues(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. Rahul S."
                                        className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-semibold"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Who is he / Tagline</label>
                                    <input
                                        type="text"
                                        value={voiceValues.whoIsHe}
                                        onChange={(e) => setVoiceValues(prev => ({ ...prev, whoIsHe: e.target.value }))}
                                        placeholder="e.g. AI Research Lead"
                                        className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Description (Testimonial Quote)</label>
                                <textarea
                                    value={voiceValues.description}
                                    onChange={(e) => setVoiceValues(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter the quote text..."
                                    rows={4}
                                    className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors text-xs font-medium leading-relaxed resize-none"
                                />
                            </div>

                            {/* Circle Image Upload */}
                            <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
                                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Profile Photo (Optional)</label>
                                <div className="flex items-center gap-5">
                                    <div className="relative w-16 h-16 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {isUploading ? (
                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-[8px] font-bold">
                                                <svg className="animate-spin h-4 w-4 text-gold-primary mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                        ) : voiceValues.pic ? (
                                            <img src={voiceValues.pic} alt="Upload Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-white/5 border border-white/10 hover:border-gold-primary/30 text-white hover:text-gold-primary py-2 px-4 rounded-xl text-[10px] font-bold uppercase transition-colors cursor-pointer"
                                            >
                                                Upload Photo
                                            </button>
                                            {voiceValues.pic && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        deleteImageFromCloudinary(voiceValues.pic);
                                                        setVoiceValues(prev => ({ ...prev, pic: "" }));
                                                    }}
                                                    className="bg-transparent border border-white/5 hover:border-red-500/30 text-white/40 hover:text-red-400 py-2 px-4 rounded-xl text-[10px] font-bold uppercase transition-colors cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <span className="text-[8px] text-[#666666] uppercase tracking-wider font-semibold">Square images format is ideal. Max 2MB.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsVoiceModalOpen(false)}
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveVoiceForm}
                                disabled={isUploading}
                                className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-2.5 px-6 rounded-full text-[10px] font-extrabold uppercase cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.1)] transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : "Confirm Voice"}
                            </button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}

            {/* MODAL: CIRCULAR IMAGE CROPPER */}
            {isCropping && (
                <Portal>
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[2000] p-4">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative animate-fade-in">
                        <h3 className="text-base font-black uppercase tracking-wider text-white mb-2 text-left">
                            Crop Profile Photo
                        </h3>
                        <p className="text-[10px] text-[#888888] mb-6 text-left uppercase tracking-wider font-semibold">
                            Drag the image to position it. Use the slider below to zoom.
                        </p>

                        {/* Circular Cropping Frame */}
                        <div
                            onMouseDown={handleCropMouseDown}
                            onMouseMove={handleCropMouseMove}
                            onMouseUp={handleCropMouseUp}
                            onMouseLeave={handleCropMouseUp}
                            onTouchStart={handleCropTouchStart}
                            onTouchMove={handleCropTouchMove}
                            onTouchEnd={handleCropMouseUp}
                            className="relative bg-black border border-white/10 overflow-hidden flex items-center justify-center shadow-lg cursor-move select-none mx-auto"
                            style={{
                                width: "240px",
                                height: "240px",
                                borderRadius: "50%"
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
                            <div className="absolute inset-0 border border-gold-primary/20 rounded-full pointer-events-none" />
                        </div>

                        {/* Zoom Slider */}
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
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-bold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveCrop}
                                className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-2.5 px-5 rounded-full text-[10px] font-bold uppercase cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.15)] transition-all hover:scale-102"
                            >
                                Crop & Upload
                            </button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}

            {/* MODAL: DELETE CONFIRMATION */}
            {voiceToDeleteIndex !== null && (
                <Portal>
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
                    <div className="bg-[#0c0c0e] border border-red-500/20 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(239,68,68,0.1)] text-center relative animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                            Confirm Deletion
                        </h3>
                        <p className="text-xs text-[#888888] leading-relaxed mb-6 uppercase tracking-wider font-semibold">
                            Are you sure you want to delete this voice? This action is permanent and cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setVoiceToDeleteIndex(null)}
                                disabled={isDeleting}
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDeleteVoice}
                                disabled={isDeleting}
                                className="bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(239,68,68,0.05)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
                </Portal>
            )}

            {/* TOAST SYSTEM FEEDBACK */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
