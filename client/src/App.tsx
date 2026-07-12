import { useState } from "react";
import Home from "./pages/Home";
import SplashScreen from "./compoenets/SplashScreen";
import PageTransition from "./compoenets/PageTransition";

export default function App() {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <>
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            {!showSplash && (
                <PageTransition>
                    <Home />
                </PageTransition>
            )}
        </>
    );
}
