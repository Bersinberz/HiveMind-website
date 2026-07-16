import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import Toast from "../../compoenets/Toast";
import MasterDataServices, { type IMasterDataOption } from "../../services/admin/MasterDataServices";
import AdminSidebar from "../../compoenets/AdminSidebar";

export default function MasterDataManagement() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Master Data list from DB
    const [options, setOptions] = useState<IMasterDataOption[]>([]);

    // Navigation and sidebar mobile controls
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Toast feedback state
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Inline input forms for adding values
    const [newInputs, setNewInputs] = useState({
        department: "",
        section: "",
        batch: "",
        year: "",
        domain: "",
        techstack: ""
    });

    const [addingCategory, setAddingCategory] = useState<string | null>(null);

    // Fetch master data from API
    const fetchOptions = async () => {
        try {
            const res = await MasterDataServices.getMasterData();
            if (res.success && res.data) {
                setOptions(res.data);
            }
        } catch (err) {
            console.error("Error fetching master data:", err);
            setToast({ message: "Failed to load master data.", type: "error" });
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
                    fetchOptions();
                } else {
                    navigate("/admin/login");
                }
            })
            .catch(() => {
                navigate("/admin/login");
            });
    }, [navigate]);


    // Add an option to a category
    const handleAddOption = async (category: "department" | "section" | "batch" | "year" | "domain" | "techstack") => {
        const val = newInputs[category].trim();
        if (!val) {
            setToast({ message: "Value cannot be empty.", type: "error" });
            return;
        }

        setAddingCategory(category);
        try {
            const res = await MasterDataServices.addMasterData(category, val);
            if (res.success && res.option) {
                setToast({ message: `"${val}" added successfully.`, type: "success" });
                setNewInputs(prev => ({ ...prev, [category]: "" }));
                fetchOptions();
            } else {
                setToast({ message: res.message || "Failed to add option.", type: "error" });
            }
        } catch (err: any) {
            console.error("Add master data option error:", err);
            setToast({ message: err.response?.data?.message || "Failed to add option.", type: "error" });
        } finally {
            setAddingCategory(null);
        }
    };

    // Delete an option
    const handleDeleteOption = async (id: string, label: string) => {
        try {
            const res = await MasterDataServices.deleteMasterData(id);
            if (res.success) {
                setToast({ message: `Option "${label}" deleted successfully.`, type: "success" });
                fetchOptions();
            } else {
                setToast({ message: res.message || "Failed to delete option.", type: "error" });
            }
        } catch (err) {
            console.error("Delete master data option error:", err);
            setToast({ message: "Failed to delete option.", type: "error" });
        }
    };


    // Filter data by category helper
    const getOptionsByCategory = (cat: string) => {
        return options.filter(opt => opt.category === cat);
    };

    const categories = [
        { key: "department" as const, title: "Departments", placeholder: "e.g. CSE" },
        { key: "section" as const, title: "Sections", placeholder: "e.g. A" },
        { key: "batch" as const, title: "Batches", placeholder: "e.g. 2023-2027" },
        { key: "year" as const, title: "Years of Study", placeholder: "e.g. 1st" },
        { key: "domain" as const, title: "Domains", placeholder: "e.g. Web Development" },
        { key: "techstack" as const, title: "Tech Stack", placeholder: "e.g. React" }
    ];

    return (
        <div className="min-h-screen bg-[#050505] flex text-white relative admin-workspace">
            {addingCategory && <AdminLoader />}
            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SHARED SIDEBAR COMPONENT */}
            <AdminSidebar
                activeTab="master_data"
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
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-wider text-white">
                                    Master Data Configuration
                                </h1>
                                <p className="text-xs text-[#888888] mt-1">
                                    Configure selection dropdown options (Departments, Sections, Batches, Years) utilized across student applications, lab members management, and top-level table filters.
                                </p>
                            </div>

                            {/* Master Data Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {categories.map(({ key, title, placeholder }) => {
                                    const currentOptions = getOptionsByCategory(key);
                                    const isAdding = addingCategory === key;
                                    return (
                                        <div key={key} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <h2 className="text-base font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">
                                                    {title} ({currentOptions.length})
                                                </h2>

                                                {/* Tags Options */}
                                                <div className="flex flex-wrap gap-2.5 min-h-[60px] content-start">
                                                    {currentOptions.length === 0 ? (
                                                        <span className="text-[10px] text-[#555555] uppercase tracking-wider font-bold italic py-2">
                                                            No options set.
                                                        </span>
                                                    ) : (
                                                        currentOptions.map(opt => (
                                                            <span
                                                                key={opt._id}
                                                                className="inline-flex items-center gap-2 bg-gold-primary/5 hover:bg-gold-primary/10 border border-gold-primary/10 text-[#DDDDDD] text-xs font-semibold px-3 py-1.5 rounded-full select-none transition-colors"
                                                            >
                                                                {opt.value}
                                                                <button
                                                                    onClick={() => handleDeleteOption(opt._id, opt.value)}
                                                                    className="text-white/40 hover:text-red-400 p-0.5 cursor-pointer bg-transparent border-none focus:outline-none flex-shrink-0"
                                                                    title="Delete"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                                    </svg>
                                                                </button>
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            {/* Inline Add Option Form */}
                                            <div className="flex gap-2 pt-4 border-t border-white/5 mt-4">
                                                <input
                                                    type="text"
                                                    value={newInputs[key]}
                                                    onChange={(e) => setNewInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                                    placeholder={placeholder}
                                                    className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleAddOption(key);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleAddOption(key)}
                                                    disabled={isAdding}
                                                    className="bg-gold-primary hover:bg-gold-light disabled:bg-white/5 text-black disabled:text-white/40 border-none px-5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-colors"
                                                >
                                                    {isAdding ? "Adding..." : "+ Add"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </main>
            </div>

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
