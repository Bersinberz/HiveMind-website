import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";

type AdminTab = "dashboard" | "team" | "projects" | "events" | "new_members";

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

    useEffect(() => {
        if (activeTab === "team") {
            navigate("/admin/team");
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

    // 4. Events View
    const renderEventsView = () => (
        <div className="space-y-8 animate-text-entrance">
            <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-8 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
                            Lab Events
                        </h2>
                        <p className="text-xs text-[#888888] mt-1">
                            Coordinate hackathons, research sessions, and tech workshops.
                        </p>
                    </div>
                    <button className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-2 px-5 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.2)] transition-all duration-300 hover:scale-102">
                        Schedule Event
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gold-primary/20 transition-all">
                        <div>
                            <span className="text-[9px] font-bold text-gold-primary uppercase tracking-widest">
                                July 20, 2026
                            </span>
                            <h3 className="font-bold text-white text-sm uppercase mt-1">
                                Generative AI Hackfest
                            </h3>
                            <p className="text-xs text-[#888888] mt-0.5">
                                Venue: Sathyabama AI Supercomputing Laboratory
                            </p>
                        </div>
                        <span className="bg-white/5 border border-white/10 text-white text-[10px] font-semibold py-1.5 px-4 rounded-full uppercase tracking-wider">
                            32 Registered
                        </span>
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gold-primary/20 transition-all">
                        <div>
                            <span className="text-[9px] font-bold text-gold-primary uppercase tracking-widest">
                                July 27, 2026
                            </span>
                            <h3 className="font-bold text-white text-sm uppercase mt-1">
                                Transformers Architecture Deep-Dive
                            </h3>
                            <p className="text-xs text-[#888888] mt-0.5">
                                Venue: SCAS Seminar Hall
                            </p>
                        </div>
                        <span className="bg-white/5 border border-white/10 text-white text-[10px] font-semibold py-1.5 px-4 rounded-full uppercase tracking-wider">
                            120 Registered
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );

    // 5. New Members View
    const renderNewMembersView = () => (
        <div className="space-y-8 animate-text-entrance">
            <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-8 shadow-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
                        New Member Applications
                    </h2>
                    <p className="text-xs text-[#888888] mt-1">
                        Review student registration queries submitted via the landing page apply portal.
                    </p>
                </div>

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
                            <tr className="hover:bg-white/[0.01] transition-colors">
                                <td className="py-3.5 pl-4 font-bold text-white flex flex-col">
                                    <span>Aditya Kumar</span>
                                    <span className="text-[10px] text-[#666666] font-normal font-sans">aditya@sathyabama.ac.in</span>
                                </td>
                                <td className="py-3.5">3rd Year</td>
                                <td className="py-3.5">Generative AI & LLMs</td>
                                <td className="py-3.5 text-center">
                                    <span className="bg-gold-primary/10 text-gold-primary border border-gold-primary/20 px-2.5 py-0.5 rounded-full font-semibold uppercase text-[9px] tracking-wider">
                                        Pending
                                    </span>
                                </td>
                                <td className="py-3.5 pr-4 text-right gap-2">
                                    <button className="bg-emerald-500 hover:bg-emerald-600 text-black text-[9px] font-extrabold uppercase py-1 px-3.5 rounded-full mr-2 cursor-pointer transition-colors">
                                        Approve
                                    </button>
                                    <button className="bg-transparent border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-[9px] font-bold uppercase py-1 px-3.5 rounded-full cursor-pointer transition-colors">
                                        Reject
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-white/[0.01] transition-colors">
                                <td className="py-3.5 pl-4 font-bold text-white flex flex-col">
                                    <span>Sneha Reddy</span>
                                    <span className="text-[10px] text-[#666666] font-normal font-sans">sneha.r@gmail.com</span>
                                </td>
                                <td className="py-3.5">2nd Year</td>
                                <td className="py-3.5">Computer Vision</td>
                                <td className="py-3.5 text-center">
                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold uppercase text-[9px] tracking-wider">
                                        Interviewed
                                    </span>
                                </td>
                                <td className="py-3.5 pr-4 text-right">
                                    <button className="bg-emerald-500 hover:bg-emerald-600 text-black text-[9px] font-extrabold uppercase py-1 px-3.5 rounded-full mr-2 cursor-pointer transition-colors">
                                        Approve
                                    </button>
                                    <button className="bg-transparent border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-[9px] font-bold uppercase py-1 px-3.5 rounded-full cursor-pointer transition-colors">
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );

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
            id: "events" as AdminTab,
            label: "Events",
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
                    {activeTab === "events" && renderEventsView()}
                    {activeTab === "new_members" && renderNewMembersView()}
                </main>
            </div>
        </div>
    );
}
