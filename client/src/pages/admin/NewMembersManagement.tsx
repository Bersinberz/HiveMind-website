import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import NewMemberServices, { type NewMember } from "../../services/admin/NewMemberServices";

export default function NewMembersManagement() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Candidate Applications State ---
    const [applications, setApplications] = useState<NewMember[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [selectedApp, setSelectedApp] = useState<NewMember | null>(null);
    const [appToDelete, setAppToDelete] = useState<string | null>(null);
    const [newMembersSubTab, setNewMembersSubTab] = useState<"pending" | "accepted" | "rejected">("pending");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const fetchApplications = async () => {
        setLoadingApps(true);
        try {
            const res = await NewMemberServices.getApplications();
            if (res.success && res.applications) {
                setApplications(res.applications);
            }
        } catch (err) {
            console.error("Error fetching applications:", err);
        } finally {
            setLoadingApps(false);
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
                    fetchApplications();
                } else {
                    navigate("/admin/login");
                }
            })
            .catch(() => {
                navigate("/admin/login");
            });
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate("/admin/login");
        } catch (error) {
            console.error("Logout failed:", error);
            navigate("/admin/login");
        }
    };

    const handleUpdateStatus = async (id: string, status: NewMember["status"]) => {
        try {
            const res = await NewMemberServices.updateApplicationStatus(id, status);
            if (res.success) {
                fetchApplications();
            } else {
                alert(res.message || "Failed to update status.");
            }
        } catch (err) {
            console.error("Update status error:", err);
        }
    };

    const executeDeleteApp = async (id: string) => {
        try {
            const res = await NewMemberServices.deleteApplication(id);
            if (res.success) {
                fetchApplications();
            } else {
                alert(res.message || "Failed to delete application.");
            }
        } catch (err) {
            console.error("Delete application error:", err);
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

    const pendingApps = applications.filter(app => app.status !== "Approved" && app.status !== "Rejected");
    const acceptedApps = applications.filter(app => app.status === "Approved");
    const rejectedApps = applications.filter(app => app.status === "Rejected");
    
    const activeList = 
        newMembersSubTab === "pending" ? pendingApps : 
        newMembersSubTab === "accepted" ? acceptedApps : 
        rejectedApps;

    return (
        <div className="min-h-screen bg-[#050505] flex text-white relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* ==========================================
               SIDEBAR - DESKTOP VIEW
               ========================================== */}
            <aside className="hidden lg:flex flex-col justify-between w-64 bg-white/[0.02] border-r border-white/5 p-6 z-10 select-none flex-shrink-0">
                <div className="space-y-8">
                    {/* Brand Logo */}
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

                    {/* Navigation Menu */}
                    <nav className="space-y-1.5">
                        {navigationItems.map((item) => {
                            const isActive = item.id === "new_members";
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

                {/* Footer Controls */}
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

            {/* ==========================================
               SIDEBAR - MOBILE SLIDEOUT DRAWER
               ========================================== */}
            {isMobileSidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    {/* Backdrop Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                    
                    <div className="relative flex flex-col justify-between w-64 bg-[#0a0a0c] border-r border-white/5 p-6 z-10 animate-[slideRight_0.3s_ease-out]">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/assets/HiveMind-Logo.png"
                                        alt="HiveMind Logo"
                                        className="h-9 w-auto"
                                    />
                                    <h2 className="text-xs font-black uppercase tracking-widest text-gold-sweep">
                                        HiveMind Admin
                                    </h2>
                                </div>
                                <button 
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className="text-white/60 hover:text-white cursor-pointer bg-transparent border-none focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <nav className="space-y-1.5">
                                {navigationItems.map((item) => {
                                    const isActive = item.id === "new_members";
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setIsMobileSidebarOpen(false);
                                                navigate(item.path);
                                            }}
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
                    </div>
                </div>
            )}

            {/* ==========================================
               MAIN CONTAINER CONTENT AREA
               ========================================== */}
            <div className="flex-1 flex flex-col min-w-0 z-10 overflow-y-auto">
                {/* Mobile Top Header */}
                <header className="lg:hidden flex justify-between items-center bg-white/[0.02] border-b border-white/5 p-4 shadow-md backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="text-white hover:text-gold-primary transition-colors focus:outline-none cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <h1 className="text-sm font-black uppercase tracking-widest text-gold-sweep">
                            HiveMind Panel
                        </h1>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center font-bold text-xs text-gold-primary">
                        {admin?.name?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
                </header>

                <header className="hidden lg:flex h-16 border-b border-white/5 items-center justify-between px-6 sm:px-10 flex-shrink-0 bg-white/[0.01] backdrop-blur-xs select-none">
                    <h1 className="text-sm font-black uppercase tracking-wider text-white">
                        Admin Workspace
                    </h1>
                    <div className="w-8 h-8 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-xs font-bold text-gold-primary uppercase [text-shadow:0_0_8px_rgba(255,193,7,0.3)] shadow-[0_0_12px_rgba(255,193,7,0.05)]">
                        {admin?.name?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
                </header>

                {/* Dashboard Tab Content Render */}
                <main className="flex-1 p-6 sm:p-10 md:p-12">
                    <div className="space-y-8 animate-text-entrance">
                        <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-8 shadow-lg">
                            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                                <div>
                                    <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
                                        New Member Applications
                                    </h2>
                                    <p className="text-xs text-[#888888] mt-1">
                                        Review student registration queries submitted via the landing page apply portal.
                                    </p>
                                </div>
                                <button 
                                    onClick={fetchApplications}
                                    className="bg-transparent border border-white/10 hover:border-gold-primary/30 text-white text-[10px] font-bold uppercase py-2 px-4 rounded-lg transition-colors cursor-pointer"
                                >
                                    Refresh Applications
                                </button>
                            </div>

                            {/* Sub-tab Switcher Menu */}
                            <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 border-b border-white/5">
                                <button
                                    onClick={() => setNewMembersSubTab("pending")}
                                    className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                        newMembersSubTab === "pending"
                                            ? "border-gold-primary text-gold-primary"
                                            : "border-transparent text-[#888888] hover:text-white"
                                    }`}
                                >
                                    Pending Review ({pendingApps.length})
                                </button>
                                <button
                                    onClick={() => setNewMembersSubTab("accepted")}
                                    className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                        newMembersSubTab === "accepted"
                                            ? "border-gold-primary text-gold-primary"
                                            : "border-transparent text-[#888888] hover:text-white"
                                    }`}
                                >
                                    Accepted Members ({acceptedApps.length})
                                </button>
                                <button
                                    onClick={() => setNewMembersSubTab("rejected")}
                                    className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                        newMembersSubTab === "rejected"
                                            ? "border-gold-primary text-gold-primary"
                                            : "border-transparent text-[#888888] hover:text-white"
                                    }`}
                                >
                                    Rejected Pool ({rejectedApps.length})
                                </button>
                            </div>

                            {loadingApps ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-3">
                                    <svg className="animate-spin h-8 w-8 text-gold-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-xs text-[#888888] uppercase tracking-wider font-bold">Querying application database...</span>
                                </div>
                            ) : activeList.length === 0 ? (
                                <div className="py-20 text-center">
                                    <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">
                                        No {newMembersSubTab} applications found
                                    </span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-[#888888] uppercase font-bold tracking-wider">
                                                <th className="pb-3 pl-4">Applicant</th>
                                                <th className="pb-3">Year</th>
                                                <th className="pb-3">Domain</th>
                                                <th className="pb-3 text-center">Status</th>
                                                <th className="pb-3 pr-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-[#DDDDDD]">
                                            {activeList.map(app => (
                                                <tr key={app._id} className="hover:bg-white/[0.01] transition-colors">
                                                    <td 
                                                        onClick={() => setSelectedApp(app)}
                                                        className="py-3.5 pl-4 font-bold text-white flex flex-col cursor-pointer hover:text-gold-primary transition-colors"
                                                    >
                                                        <span>{app.fullname}</span>
                                                        <span className="text-[10px] text-[#666666] font-normal font-sans">{app.email}</span>
                                                    </td>
                                                    <td className="py-3.5">{app.year} Year</td>
                                                    <td className="py-3.5 max-w-[120px] truncate">{app.domainOfInterest}</td>
                                                    <td className="py-3.5 text-center">
                                                        <span className={`border px-2.5 py-0.5 rounded-full font-semibold uppercase text-[9px] tracking-wider ${
                                                            app.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                            app.status === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                            app.status === "Interviewed" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                            "bg-gold-primary/10 text-gold-primary border-gold-primary/20"
                                                        }`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 pr-4 text-right">
                                                        {newMembersSubTab === "pending" ? (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(app._id, "Approved")}
                                                                    className="bg-emerald-500 hover:bg-emerald-600 text-black text-[9px] font-extrabold uppercase py-1.5 px-4 rounded-full mr-2 cursor-pointer transition-colors"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(app._id, "Rejected")}
                                                                    className="bg-transparent border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-[9px] font-bold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        ) : newMembersSubTab === "accepted" ? (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(app._id, "Rejected")}
                                                                    className="bg-transparent border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-[9px] font-bold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors mr-2"
                                                                >
                                                                    Reject
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(app._id, "Pending")}
                                                                    className="bg-transparent border border-white/10 hover:border-gold-primary/30 text-white/60 hover:text-gold-primary text-[9px] font-bold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors"
                                                                >
                                                                    Restore to Pending
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(app._id, "Approved")}
                                                                    className="bg-emerald-500 hover:bg-emerald-600 text-black text-[9px] font-extrabold uppercase py-1.5 px-4 rounded-full mr-2 cursor-pointer transition-colors"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(app._id, "Pending")}
                                                                    className="bg-transparent border border-white/10 hover:border-gold-primary/30 text-white/60 hover:text-gold-primary text-[9px] font-bold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors"
                                                                >
                                                                    Restore to Pending
                                                                </button>
                                                            </>
                                                        )}
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

            {/* Custom View Applicant Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[10000] p-4 overflow-y-auto">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative my-8 animate-text-entrance text-left">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                                    Applicant Details
                                </h3>
                                <span className="text-[9px] text-[#888888] uppercase tracking-widest font-black block mt-0.5">
                                    Submitted {new Date(selectedApp.createdAt || "").toLocaleString()}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="text-[#888888] hover:text-white transition-colors cursor-pointer focus:outline-none bg-transparent border-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs max-h-[450px] overflow-y-auto pr-2">
                            {/* Personal */}
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Full Name</span>
                                    <span className="text-white font-semibold">{selectedApp.fullname}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Register Number</span>
                                    <span className="text-white font-semibold">{selectedApp.registerNumber}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Email Address</span>
                                    <a href={`mailto:${selectedApp.email}`} className="text-gold-primary hover:underline font-semibold">{selectedApp.email}</a>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Phone Number</span>
                                    <span className="text-white font-semibold">{selectedApp.phoneNumber}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Department & Year</span>
                                    <span className="text-white font-semibold">{selectedApp.dept} — {selectedApp.year} Year</span>
                                </div>
                            </div>

                            {/* Links & Technical */}
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Domain of Interest</span>
                                    <span className="text-gold-primary font-black uppercase tracking-widest text-[10px]">{selectedApp.domainOfInterest}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Programming Languages</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedApp.programmingLanguages.map((lang, i) => (
                                            <span key={i} className="bg-white/5 border border-white/10 text-white/80 text-[8px] font-bold px-2 py-0.5 rounded font-mono">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Hours available per week</span>
                                    <span className="text-white font-semibold">{selectedApp.hoursPerWeek} hours</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Referral Source</span>
                                    <span className="text-white font-semibold">{selectedApp.howDidYouHear}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Social & Resume Profiles</span>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold-primary text-[10px] font-bold uppercase tracking-wider no-underline">LinkedIn</a>
                                        {selectedApp.github && (
                                            <>
                                                <span className="text-white/10">|</span>
                                                <a href={selectedApp.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold-primary text-[10px] font-bold uppercase tracking-wider no-underline">GitHub</a>
                                            </>
                                        )}
                                        {selectedApp.portfolio && (
                                            <>
                                                <span className="text-white/10">|</span>
                                                <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold-primary text-[10px] font-bold uppercase tracking-wider no-underline">Portfolio</a>
                                            </>
                                        )}
                                        <span className="text-white/10">|</span>
                                        <a href={selectedApp.resume} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold uppercase tracking-wider no-underline">Resume PDF</a>
                                    </div>
                                </div>
                            </div>

                            {/* Essay Question */}
                            <div className="col-span-1 sm:col-span-2 border-t border-white/5 pt-4 space-y-1.5">
                                <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Why do you want to join HiveMind?</span>
                                <p className="text-[#BBBBBB] leading-relaxed italic whitespace-pre-wrap">{selectedApp.whyJoin}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-6">
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {appToDelete && (
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
                            Are you sure you want to delete this applicant? This action is permanent and cannot be undone.
                        </p>
                        
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setAppToDelete(null)}
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const id = appToDelete;
                                    setAppToDelete(null);
                                    await executeDeleteApp(id);
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
