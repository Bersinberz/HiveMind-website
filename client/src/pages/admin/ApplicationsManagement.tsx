import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import ApplicationServices, { type Application } from "../../services/admin/ApplicationServices";
import AdminSidebar from "../../compoenets/AdminSidebar";

export default function ApplicationsManagement() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Candidate Applications State ---
    const [applications, setApplications] = useState<Application[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [appToDelete, setAppToDelete] = useState<string | null>(null);
    const [applicationsSubTab, setApplicationsSubTab] = useState<"pending" | "interviewed" | "accepted" | "rejected">("pending");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // --- Interview Scheduling States ---
    const [schedulingAppId, setSchedulingAppId] = useState<string | null>(null);
    const [schedDate, setSchedDate] = useState("");
    const [schedTime, setSchedTime] = useState("");

    const fetchApplications = async () => {
        setLoadingApps(true);
        try {
            const res = await ApplicationServices.getApplications();
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

    const handleUpdateStatus = async (
        id: string, 
        status: Application["status"], 
        interviewDate?: string, 
        interviewTime?: string
    ) => {
        try {
            const res = await ApplicationServices.updateApplicationStatus(id, status, interviewDate, interviewTime);
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
            const res = await ApplicationServices.deleteApplication(id);
            if (res.success) {
                fetchApplications();
            } else {
                alert(res.message || "Failed to delete application.");
            }
        } catch (err) {
            console.error("Delete application error:", err);
        }
    };

    const pendingApps = applications.filter(app => app.status === "Pending");
    const interviewedApps = applications.filter(app => app.status === "Interviewed");
    const acceptedApps = applications.filter(app => app.status === "Approved");
    const rejectedApps = applications.filter(app => app.status === "Rejected");
    
    const activeList = 
        applicationsSubTab === "pending" ? pendingApps : 
        applicationsSubTab === "interviewed" ? interviewedApps : 
        applicationsSubTab === "accepted" ? acceptedApps : 
        rejectedApps;

    return (
        <div className="min-h-screen bg-[#050505] flex text-white relative admin-workspace">
            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SHARED SIDEBAR COMPONENT */}
            <AdminSidebar
                activeTab="applications"
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                admin={admin}
            />

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
                            <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-8 shadow-lg">
                                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                                    <div>
                                        <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
                                            Applications Management
                                        </h2>
                                        <p className="text-xs text-[#888888] mt-1">
                                            Review student registration applications submitted via the landing page join portal.
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
                                        onClick={() => setApplicationsSubTab("pending")}
                                        className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                            applicationsSubTab === "pending"
                                                ? "border-gold-primary text-gold-primary"
                                                : "border-transparent text-[#888888] hover:text-white"
                                        }`}
                                    >
                                        Pending Review ({pendingApps.length})
                                    </button>
                                    <button
                                        onClick={() => setApplicationsSubTab("interviewed")}
                                        className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                            applicationsSubTab === "interviewed"
                                                ? "border-gold-primary text-gold-primary"
                                                : "border-transparent text-[#888888] hover:text-white"
                                        }`}
                                    >
                                        Technical Discussion ({interviewedApps.length})
                                    </button>
                                    <button
                                        onClick={() => setApplicationsSubTab("accepted")}
                                        className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                            applicationsSubTab === "accepted"
                                                ? "border-gold-primary text-gold-primary"
                                                : "border-transparent text-[#888888] hover:text-white"
                                        }`}
                                    >
                                        Accepted ({acceptedApps.length})
                                    </button>
                                    <button
                                        onClick={() => setApplicationsSubTab("rejected")}
                                        className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                            applicationsSubTab === "rejected"
                                                ? "border-gold-primary text-gold-primary"
                                                : "border-transparent text-[#888888] hover:text-white"
                                        }`}
                                    >
                                        Rejected Pool ({rejectedApps.length})
                                    </button>
                                </div>

                                {loadingApps ? (
                                    <div className="flex items-center justify-center gap-3 py-20 select-none">
                                        <svg className="animate-spin h-5 w-5 text-gold-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-xs text-[#888888] uppercase tracking-wider font-bold">Querying application database...</span>
                                    </div>
                                ) : activeList.length === 0 ? (
                                    <div className="py-20 text-center select-none">
                                        <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">
                                            No {applicationsSubTab} applications found
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
                                                            {app.status === "Interviewed" && app.interviewDate && (
                                                                <span className="text-[9px] text-gold-primary mt-1 font-semibold uppercase tracking-wider">
                                                                    Interview: {app.interviewDate} @ {app.interviewTime}
                                                                </span>
                                                            )}
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
                                                            <button 
                                                                onClick={() => setSelectedApp(app)}
                                                                className="bg-white/5 hover:bg-white/10 text-white text-[9px] font-extrabold uppercase py-1.5 px-4 rounded-full mr-2 cursor-pointer transition-colors"
                                                            >
                                                                View Form
                                                            </button>
                                                            {applicationsSubTab === "pending" ? (
                                                                <button 
                                                                    onClick={() => {
                                                                        setSchedulingAppId(app._id);
                                                                        setSchedDate("");
                                                                        setSchedTime("");
                                                                    }}
                                                                    className="bg-gold-primary hover:bg-[#D4AF37] text-black text-[9px] font-extrabold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors"
                                                                >
                                                                    Schedule Interview
                                                                </button>
                                                            ) : applicationsSubTab === "interviewed" ? (
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
                                                            ) : applicationsSubTab === "accepted" ? (
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
                    )}
                </main>
            </div>

            {/* Custom View Applicant Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[10000] p-4 overflow-y-auto">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative my-8 animate-fade-in text-left">
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
                            
                            {selectedApp.status === "Interviewed" && selectedApp.interviewDate && (
                                <div className="col-span-1 sm:col-span-2 border-t border-white/5 pt-4">
                                    <span className="text-[9px] font-bold text-gold-primary uppercase tracking-wider block">Technical Discussion Schedule</span>
                                    <span className="text-white font-semibold">
                                        {selectedApp.interviewDate} at {selectedApp.interviewTime} (Supercomputing Lab)
                                    </span>
                                </div>
                            )}

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

            {/* Custom Interview Scheduling Modal */}
            {schedulingAppId && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative animate-fade-in text-left">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                            Schedule Interview
                        </h3>
                        <p className="text-xs text-[#888888] leading-relaxed mb-6 uppercase tracking-wider font-semibold">
                            Select date and time for the technical discussion at Supercomputing Lab. The candidate will receive an invitation email.
                        </p>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Interview Date</label>
                                <input
                                    type="date"
                                    required
                                    className="bg-white/[0.02] border border-white/5 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                    value={schedDate}
                                    onChange={(e) => setSchedDate(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Interview Time</label>
                                <input
                                    type="time"
                                    required
                                    className="bg-white/[0.02] border border-white/5 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                    value={schedTime}
                                    onChange={(e) => setSchedTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSchedulingAppId(null)}
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!schedDate || !schedTime) {
                                        alert("Please select both date and time.");
                                        return;
                                    }
                                    const id = schedulingAppId;
                                    setSchedulingAppId(null);
                                    await handleUpdateStatus(id, "Interviewed", schedDate, schedTime);
                                }}
                                className="bg-gold-primary hover:bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(255,193,7,0.1)]"
                            >
                                Confirm & Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
