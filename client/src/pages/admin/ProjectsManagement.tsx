import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import Toast from "../../compoenets/Toast";
import ProjectServices, { type Project } from "../../services/admin/ProjectServices";
import axiosInstance from "../../services/axiosInstance";
import AdminSidebar from "../../compoenets/AdminSidebar";
import DomainServices, { type DomainOption } from "../../services/admin/DomainServices";
import TechnologyServices, { type TechnologyOption } from "../../services/admin/TechnologyServices";
import CustomSingleSelect from "../../compoenets/CustomSingleSelect";

// MultiSelect Dropdown Component
function MultiSelect({
    label,
    options,
    selected,
    onChange,
    placeholder
}: {
    label: string;
    options: string[];
    selected: string[];
    onChange: (values: string[]) => void;
    placeholder: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (val: string) => {
        if (selected.includes(val)) {
            onChange(selected.filter(x => x !== val));
        } else {
            onChange([...selected, val]);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 relative text-left">
            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white cursor-pointer flex justify-between items-center select-none"
            >
                <div className="flex flex-wrap gap-1 max-w-[90%] truncate">
                    {selected.length === 0 ? (
                        <span className="text-white/40">{placeholder}</span>
                    ) : (
                        selected.map((val, idx) => (
                            <span key={idx} className="bg-gold-primary/10 border border-gold-primary/20 text-gold-primary px-2 py-0.5 rounded text-[10px] font-bold">
                                {val}
                            </span>
                        ))
                    )}
                </div>
                <svg className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-[100%] left-0 right-0 mt-1 bg-[#0c0c0e] border border-white/10 rounded-lg shadow-2xl z-50 max-h-[148px] overflow-y-auto p-2 space-y-1">
                        {options.length === 0 ? (
                            <div className="p-2 text-center text-xs text-white/40 italic">
                                No options found in Master Data.
                            </div>
                        ) : (
                            options.map((opt, idx) => {
                                const isChecked = selected.includes(opt);
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => toggleOption(opt)}
                                        className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors text-xs"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            readOnly
                                            className="accent-gold-primary h-3.5 w-3.5 rounded bg-black/40 border-white/10"
                                        />
                                        <span className={isChecked ? "text-gold-primary font-bold" : "text-white/80"}>
                                            {opt}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

interface ProjectTechSelectProps {
    label: string;
    allTechs: TechnologyOption[];
    selectedDomainNames: string[];
    selectedTechNames: string[];
    onChange: (names: string[]) => void;
    allDomains: DomainOption[];
}

function ProjectTechSelect({
    label,
    allTechs,
    selectedDomainNames,
    selectedTechNames,
    onChange,
    allDomains,
}: ProjectTechSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Find the IDs of the selected domains
    const selectedDomainIds = allDomains
        .filter(dom => selectedDomainNames.includes(dom.name))
        .map(dom => dom._id);

    // Group technologies into suggested vs other active techs
    const suggestedTechs = allTechs.filter(tech =>
        tech.isActive && tech.domains.some(dom => selectedDomainIds.includes(dom._id))
    );

    const otherTechs = allTechs.filter(tech =>
        tech.isActive && !tech.domains.some(dom => selectedDomainIds.includes(dom._id))
    );

    // Apply search filter
    const searchFilter = (tech: TechnologyOption) =>
        tech.name.toLowerCase().includes(search.toLowerCase());

    const filteredSuggested = suggestedTechs.filter(searchFilter);
    const filteredOthers = otherTechs.filter(searchFilter);

    const toggleOption = (name: string) => {
        if (selectedTechNames.includes(name)) {
            onChange(selectedTechNames.filter(x => x !== name));
        } else {
            onChange([...selectedTechNames, name]);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 relative text-left">
            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white cursor-pointer flex justify-between items-center select-none min-h-[38px]"
            >
                <div className="flex flex-wrap gap-1 max-w-[90%] truncate">
                    {selectedTechNames.length === 0 ? (
                        <span className="text-white/40">Select Tech Stack</span>
                    ) : (
                        selectedTechNames.map((val, idx) => (
                            <span key={idx} className="bg-gold-primary/10 border border-gold-primary/20 text-gold-primary px-2 py-0.5 rounded text-[10px] font-bold">
                                {val}
                            </span>
                        ))
                    )}
                </div>
                <svg className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-[100%] left-0 right-0 mt-1 bg-[#0c0c0e] border border-white/10 rounded-lg shadow-2xl z-50 max-h-[180px] overflow-y-auto p-2.5 space-y-2">
                        {/* Search Input */}
                        <div className="px-1 py-0.5">
                            <input
                                type="text"
                                placeholder="Search technologies..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-primary/50"
                            />
                        </div>

                        {/* Suggested Technologies */}
                        {selectedDomainIds.length > 0 && (
                            <div className="space-y-1">
                                <div className="text-[9px] font-extrabold uppercase tracking-widest text-gold-primary/80 px-2 py-1 bg-gold-primary/5 rounded border border-gold-primary/10">
                                    Suggested Technologies
                                </div>
                                {filteredSuggested.length === 0 ? (
                                    <div className="text-[10px] text-white/20 italic px-2 py-1">No suggested technologies match search</div>
                                ) : (
                                    filteredSuggested.map(tech => {
                                        const isChecked = selectedTechNames.includes(tech.name);
                                        return (
                                            <div
                                                key={tech._id}
                                                onClick={() => toggleOption(tech.name)}
                                                className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-white/5 rounded-md cursor-pointer transition-colors text-xs"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    readOnly
                                                    className="accent-gold-primary h-3.5 w-3.5 rounded bg-black/40 border-white/10"
                                                />
                                                <span className={isChecked ? "text-gold-primary font-bold" : "text-white/80"}>
                                                    {tech.name}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {/* All / Other Technologies */}
                        <div className="space-y-1">
                            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#888888] px-2 py-1 border-b border-white/5">
                                {selectedDomainIds.length > 0 ? "Other Technologies" : "All Technologies"}
                            </div>
                            {filteredOthers.length === 0 ? (
                                <div className="text-[10px] text-white/20 italic px-2 py-1">No other technologies found</div>
                            ) : (
                                filteredOthers.map(tech => {
                                    const isChecked = selectedTechNames.includes(tech.name);
                                    return (
                                        <div
                                            key={tech._id}
                                            onClick={() => toggleOption(tech.name)}
                                            className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-white/5 rounded-md cursor-pointer transition-colors text-xs"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                readOnly
                                                className="accent-gold-primary h-3.5 w-3.5 rounded bg-black/40 border-white/10"
                                            />
                                            <span className={isChecked ? "text-gold-primary font-bold" : "text-white/80"}>
                                                {tech.name}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {allTechs.length === 0 && (
                            <div className="p-2 text-center text-xs text-white/40 italic">
                                No technologies found.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

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

    // --- Master Data Options state ---
    const [domainsList, setDomainsList] = useState<DomainOption[]>([]);
    const [techList, setTechList] = useState<TechnologyOption[]>([]);

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
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [formValues, setFormValues] = useState({
        title: "",
        description: "",
        domain: [] as string[],
        techStack: [] as string[],
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

    const fetchMasterAndNewData = async () => {
        try {
            const [domRes, techRes] = await Promise.all([
                DomainServices.getDomains(),
                TechnologyServices.getTechnologies()
            ]);
            if (domRes.success && domRes.data) {
                setDomainsList(domRes.data);
            }
            if (techRes.success && techRes.data) {
                setTechList(techRes.data);
            }
        } catch (err) {
            console.error("Error fetching master data inputs:", err);
        }
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
                    fetchMasterAndNewData();
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
            domain: [],
            techStack: [],
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
            domain: Array.isArray(project.domain) ? project.domain : [project.domain].filter(Boolean),
            techStack: project.techStack,
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
        if (formValues.domain.length === 0) {
            setToast({ message: "Please select at least one domain.", type: "error" });
            return;
        }
        if (formValues.techStack.length === 0) {
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

        try {
            if (modalMode === "add") {
                const res = await ProjectServices.createProject(formValues);
                if (res.success) {
                    setIsModalOpen(false);
                    setToast({ message: "Project created successfully.", type: "success" });
                    fetchProjects();
                } else {
                    setToast({ message: res.message || "Failed to create project.", type: "error" });
                }
            } else {
                const res = await ProjectServices.updateProject(editingProjectId, formValues);
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



    const domains = Array.from(new Set(projects.flatMap(p => p.domain))).filter(Boolean);
    const masterDomains = domainsList.map(o => o.name);

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDomain = !selectedDomain || (Array.isArray(p.domain) ? p.domain.includes(selectedDomain) : p.domain === selectedDomain);

        return matchesSearch && matchesDomain;
    });

    return (
        <div className="min-h-screen bg-[#050505] flex text-white relative admin-workspace">
            {/* Custom Toast Alert Component */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SHARED SIDEBAR COMPONENT */}
            <AdminSidebar
                activeTab="projects"
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                admin={admin}
            />

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0 z-10 overflow-y-auto">
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

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                                    <div className="flex flex-col gap-1.5 col-span-2">
                                        <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search projects..."
                                            className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 col-span-2">
                                        <CustomSingleSelect
                                            label="Domain"
                                            bgClass="bg-[#0c0c0e] border border-white/10 py-2 px-3 text-xs h-[38px]"
                                            dropdownBgClass="bg-[#0c0c0e]"
                                            options={[
                                                { value: "", label: "All Domains" },
                                                ...domains.map(dom => ({ value: dom, label: dom }))
                                            ]}
                                            value={selectedDomain}
                                            onChange={setSelectedDomain}
                                            placeholder="All Domains"
                                        />
                                    </div>
                                </div>

                                {loadingProjects ? (
                                    <div className="flex items-center justify-center gap-3 py-20 select-none">
                                        <svg className="animate-spin h-5 w-5 text-gold-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                                    <th className="pb-3 pl-4">Project</th>
                                                    <th className="pb-3">Tech Stack</th>
                                                    <th className="pb-3">Timeline & Links</th>
                                                    <th className="pb-3 pr-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-[#DDDDDD]">
                                                {filteredProjects.map(project => (
                                                    <tr key={project._id} className="hover:bg-white/[0.01] transition-colors">
                                                        <td className="py-3.5 pl-4 flex items-start gap-4 max-w-sm">
                                                            {project.thumbnail ? (
                                                                <img src={project.thumbnail} alt="thumbnail" className="w-16 h-10 object-cover border border-white/5 rounded-lg flex-shrink-0" />
                                                            ) : (
                                                                <div className="w-16 h-10 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-[10px] text-white/40 uppercase font-black tracking-wider flex-shrink-0">
                                                                    AI
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-white text-[13px]">{project.title}</span>
                                                                <span className="text-[9px] text-[#888888] uppercase tracking-wider font-bold mt-0.5">{Array.isArray(project.domain) ? project.domain.join(" • ") : project.domain}</span>
                                                                <p className="text-[11px] text-[#666666] line-clamp-2 mt-1 leading-normal font-sans">{project.description}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5">
                                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                                {project.techStack.map((tech, idx) => (
                                                                    <span key={idx} className="bg-white/5 text-[#AAAAAA] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                                                                        {tech}
                                                                    </span>
                                                                ))}
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
                    )}
                </main>
            </div>

            {/* Modals: Crop Upload / Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 overflow-y-auto">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-4xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative my-8 animate-fade-in">
                        {isUploading ? (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none animate-fade-in">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column - Media & Details */}
                                        <div className="space-y-4">
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
                                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Project Description *</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary resize-none"
                                                    value={formValues.description}
                                                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column - Info Fields */}
                                        <div className="space-y-4">
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

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <MultiSelect
                                                    label="Domains *"
                                                    options={masterDomains}
                                                    selected={formValues.domain}
                                                    onChange={(vals) => setFormValues({ ...formValues, domain: vals })}
                                                    placeholder="Select Domains"
                                                />
                                                <ProjectTechSelect
                                                    label="Tech Stack *"
                                                    allTechs={techList}
                                                    selectedDomainNames={formValues.domain}
                                                    selectedTechNames={formValues.techStack}
                                                    onChange={(vals) => setFormValues({ ...formValues, techStack: vals })}
                                                    allDomains={domainsList}
                                                />
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
                                                        className="bg-[#050505] bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary scheme-dark"
                                                        value={formValues.endDate}
                                                        onChange={(e) => setFormValues({ ...formValues, endDate: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-6">
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
