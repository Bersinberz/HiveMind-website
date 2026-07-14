import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import NewMemberServices, { type NewMember } from "../../services/admin/NewMemberServices";


type AdminTab = "dashboard" | "team" | "projects" | "new_members";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") as AdminTab) || "dashboard";
    const setActiveTab = (newTab: AdminTab) => {
        setSearchParams({ tab: newTab });
    };

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // --- Candidate Applications State ---
    const [applications, setApplications] = useState<NewMember[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [selectedApp, setSelectedApp] = useState<NewMember | null>(null);
    const [appToDelete, setAppToDelete] = useState<string | null>(null);
    const [newMembersSubTab, setNewMembersSubTab] = useState<"pending" | "accepted" | "rejected">("pending");

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
        if (activeTab === "new_members") {
            fetchApplications();
        }
    }, [activeTab]);

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


    useEffect(() => {
        if (activeTab === "team") {
            navigate("/admin/team");
        } else if (activeTab === "projects") {
            navigate("/admin/projects");
        }
    }, [activeTab, navigate]);

    useEffect(() => {
        // Authenticate admin based on HttpOnly cookie session
        authService
            .getAdminStatus()
            .then((data) => {
                if (data.success && data.admin) {
                    setAdmin(data.admin);
                    setLoading(false);
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

    if (loading) {
        return <AdminLoader />;
    }

    // ==========================================
    // SUB-VIEWS RENDERING LOGIC
    // ==========================================

    // 1. Dashboard View
    const renderDashboardView = () => (
        <div className="space-y-8 animate-text-entrance">
            <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-8 shadow-lg">
                <h2 className="text-xl font-extrabold uppercase tracking-wider text-white mb-4">
                    System Status Overview
                </h2>
                <p className="text-sm text-[#AAAAAA] leading-relaxed mb-6">
                    Welcome back, <strong className="text-white">{admin?.name}</strong>. The Sathyabama AI Supercomputing nodes are operating at normal limits. Core cluster telemetry details and server metrics are updated below.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                            Cluster Load
                        </span>
                        <span className="text-2xl font-black text-gold-primary">34.8%</span>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                            Active Nodes
                        </span>
                        <span className="text-2xl font-black text-white">16 / 16</span>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                            Network Latency
                        </span>
                        <span className="text-2xl font-black text-emerald-400">1.2 ms</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-lg">
                    <h3 className="text-base font-bold uppercase tracking-wider mb-6 text-white border-b border-white/5 pb-3">
                        Recent Lab Activities
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" />
                                <span className="text-white">Admin user login initiated</span>
                            </div>
                            <span className="text-[#666666]">{admin?.email}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-[#AAAAAA]">GPU Node #4 LLaMA fine-tuning complete</span>
                            </div>
                            <span className="text-[#666666]">10 mins ago</span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-[#AAAAAA]">RAG Pipeline database re-indexing finished</span>
                            </div>
                            <span className="text-[#666666]">42 mins ago</span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-2">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-[#AAAAAA]">System backup archive scheduled</span>
                            </div>
                            <span className="text-[#666666]">2 hours ago</span>
                        </div>
                    </div>
                </section>

                <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-lg">
                    <h3 className="text-base font-bold uppercase tracking-wider mb-6 text-white border-b border-white/5 pb-3">
                        Administrator Profile
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">
                                Full Name
                            </span>
                            <span className="text-sm font-semibold text-white">{admin?.name}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">
                                Email Address
                            </span>
                            <span className="text-sm font-semibold text-white">{admin?.email}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">
                                Assigned Role
                            </span>
                            <span className="text-xs font-bold text-gold-primary uppercase tracking-widest bg-gold-primary/10 border border-gold-primary/20 rounded-full px-3 py-1 mt-1 inline-block">
                                {admin?.role}
                            </span>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between text-xs bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                                <span>Session Security</span>
                                <span className="text-gold-primary font-bold uppercase tracking-widest text-[9px]">
                                    HttpOnly Cookie
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );

    // 2. Team Management Redirect Placeholder
    const renderTeamView = () => (
        <div className="text-center py-20 text-[#666666] uppercase text-xs font-bold animate-pulse">
            Redirecting to Team management...
        </div>
    );

    // 3. Projects View
    const renderProjectsView = () => (
        <div className="space-y-8 animate-text-entrance">
            <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-8 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
                            Active Projects
                        </h2>
                        <p className="text-xs text-[#888888] mt-1">
                            Review artificial intelligence research and development pipelines.
                        </p>
                    </div>
                    <button className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-2 px-5 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.2)] transition-all duration-300 hover:scale-102">
                        Create Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:border-gold-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                                LLM Fine-Tuning Pipeline
                            </h3>
                            <span className="bg-gold-primary/10 text-gold-primary border border-gold-primary/20 text-[9px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                Training
                            </span>
                        </div>
                        <p className="text-xs text-[#AAAAAA] leading-relaxed mb-4">
                            Adapting open-source foundation models (LLaMA 3) to institutional domain specific knowledge bases.
                        </p>
                        <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[10px] text-[#666666]">
                            <span>GPU Cluster Node 04</span>
                            <span className="font-bold text-white">4x RTX 4090s</span>
                        </div>
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:border-gold-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                                Autonomous RAG Agents
                            </h3>
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                Deployed
                            </span>
                        </div>
                        <p className="text-xs text-[#AAAAAA] leading-relaxed mb-4">
                            Constructing multi-agent workflows executing file analysis and research review systems.
                        </p>
                        <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[10px] text-[#666666]">
                            <span>API Gateway Active</span>
                            <span className="font-bold text-white">Vector DB Core</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );



    // 5. New Members View (Applications under review)
    const renderNewMembersView = () => {
        const pendingApps = applications.filter(app => app.status !== "Approved" && app.status !== "Rejected");
        const acceptedApps = applications.filter(app => app.status === "Approved");
        const rejectedApps = applications.filter(app => app.status === "Rejected");
        
        const activeList = 
            newMembersSubTab === "pending" ? pendingApps : 
            newMembersSubTab === "accepted" ? acceptedApps : 
            rejectedApps;

        return (
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
        );
    };







    // Sidebar navigation list items helper
    const navigationItems = [
        {
            id: "dashboard" as AdminTab,
            label: "Dashboard",
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
            id: "team" as AdminTab,
            label: "Team management",
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
            id: "projects" as AdminTab,
            label: "Projects",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            ),
        },

        {
            id: "new_members" as AdminTab,
            label: "new members",
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
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.id === "team") {
                                            navigate("/admin/team");
                                        } else if (item.id === "projects") {
                                            navigate("/admin/projects");
                                        } else {
                                            setActiveTab(item.id);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                        isActive
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

                {/* Footer Section */}
                <div className="space-y-4 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center font-bold text-xs text-gold-primary">
                            {admin?.name?.substring(0, 2).toUpperCase() || "AD"}
                        </div>
                        <div className="truncate">
                            <span className="text-xs font-bold block text-white truncate">{admin?.name}</span>
                            <span className="text-[9px] text-[#666666] uppercase block font-semibold">{admin?.role}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:border-red-500/40 text-xs text-[#AAAAAA] hover:text-red-400 py-3 rounded-xl cursor-pointer transition-all duration-300 font-bold tracking-widest uppercase"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsMobileSidebarOpen(false)}>
                    <aside className="w-64 h-full bg-[#050505] border-r border-white/5 p-6 flex flex-col justify-between z-50 animate-text-entrance" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/assets/HiveMind-Logo.png"
                                        alt="HiveMind Logo"
                                        className="h-8 w-auto filter drop-shadow-[0_0_8px_rgba(255,193,7,0.3)]"
                                    />
                                    <h2 className="text-xs font-black uppercase tracking-widest text-gold-sweep">
                                        HiveMind Admin
                                    </h2>
                                </div>
                                <button onClick={() => setIsMobileSidebarOpen(false)} className="text-[#888888] hover:text-white cursor-pointer focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <nav className="space-y-1.5">
                                {navigationItems.map((item) => {
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                if (item.id === "team") {
                                                    navigate("/admin/team");
                                                } else if (item.id === "projects") {
                                                    navigate("/admin/projects");
                                                } else {
                                                    setActiveTab(item.id);
                                                }
                                                setIsMobileSidebarOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                                isActive
                                                    ? "bg-gold-primary/10 border border-gold-primary/20 text-gold-primary [text-shadow:0_0_10px_rgba(255,193,7,0.25)]"
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
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center font-bold text-xs text-gold-primary">
                                    {admin?.name?.substring(0, 2).toUpperCase() || "AD"}
                                </div>
                                <div className="truncate">
                                    <span className="text-xs font-bold block text-white truncate">{admin?.name}</span>
                                    <span className="text-[9px] text-[#666666] uppercase block font-semibold">{admin?.role}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:border-red-500/40 text-xs text-[#AAAAAA] hover:text-red-400 py-3 rounded-xl cursor-pointer transition-all duration-300 font-bold tracking-widest uppercase"
                            >
                                Sign Out
                            </button>
                        </div>
                    </aside>
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

                {/* Dashboard Tab Content Render */}
                <main className="flex-1 p-6 sm:p-10 md:p-12">
                    {activeTab === "dashboard" && renderDashboardView()}
                    {activeTab === "team" && renderTeamView()}
                    {activeTab === "projects" && renderProjectsView()}

                    {activeTab === "new_members" && renderNewMembersView()}
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

