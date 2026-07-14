import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/website/Home";
import Team from "./pages/website/Team";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeamManagement from "./pages/admin/TeamManagement";
import SplashScreen from "./compoenets/SplashScreen";
import PageTransition from "./compoenets/PageTransition";

export default function App() {
    // Bypass splash screen for administrative routes
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
