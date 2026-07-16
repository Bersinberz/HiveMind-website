import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/website/Home";
import Team from "./pages/website/Team";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeamManagement from "./pages/admin/TeamManagement";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import ApplicationsManagement from "./pages/admin/ApplicationsManagement";
import CommunitySettingsManagement from "./pages/admin/CommunitySettingsManagement";
import MasterDataManagement from "./pages/admin/MasterDataManagement";
import Projects from "./pages/website/Projects";
import JoinHiveMind from "./pages/website/JoinHiveMind";
import SplashScreen from "./compoenets/SplashScreen";
import PageTransition from "./compoenets/PageTransition";

export default function App() {
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const [showSplash, setShowSplash] = useState(!isAdminRoute);

    return (
        <Router>
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            <Routes>
                <Route
                    path="/"
                    element={
                        <PageTransition>
                            <Home />
                        </PageTransition>
                    }
                />
                <Route
                    path="/projects"
                    element={
                        <PageTransition>
                            <Projects />
                        </PageTransition>
                    }
                />
                <Route
                    path="/join"
                    element={
                        <PageTransition>
                            <JoinHiveMind />
                        </PageTransition>
                    }
                />
                <Route
                    path="/team"
                    element={
                        <PageTransition>
                            <Team />
                        </PageTransition>
                    }
                />
                <Route
                    path="/admin/login"
                    element={
                        <PageTransition>
                            <AdminLogin />
                        </PageTransition>
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        <PageTransition>
                            <AdminDashboard />
                        </PageTransition>
                    }
                />
                <Route
                    path="/admin/team"
                    element={
                        <PageTransition>
                            <TeamManagement />
                        </PageTransition>
                    }
                />
                <Route
                    path="/admin/projects"
                    element={
                        <PageTransition>
                            <ProjectsManagement />
                        </PageTransition>
                    }
                />
                <Route
                    path="/admin/applications"
                    element={
                        <PageTransition>
                            <ApplicationsManagement />
                        </PageTransition>
                    }
                />
                <Route
                    path="/admin/community-settings"
                    element={
                        <PageTransition>
                            <CommunitySettingsManagement />
                        </PageTransition>
                    }
                />
                <Route
                    path="/admin/master-data"
                    element={
                        <PageTransition>
                            <MasterDataManagement />
                        </PageTransition>
                    }
                />
                {/* Fallback route */}
                <Route
                    path="*"
                    element={
                        <PageTransition>
                            <Home />
                        </PageTransition>
                    }
                />
            </Routes>
        </Router>
    );
}
