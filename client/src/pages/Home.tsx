import Navbar from "../compoenets/Navbar";
import HeroSection from "../compoenets/HeroSection";
import AboutSection from "../compoenets/AboutSection";
import MissionSection from "../compoenets/MissionSection";
import DomainsSection from "../compoenets/DomainsSection";
import TestimonialsSection from "../compoenets/TestimonialsSection";
import JoinSection from "../compoenets/JoinSection";

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <AboutSection />
                <MissionSection />
                <DomainsSection />
                <TestimonialsSection />
                <JoinSection />
            </main>
        </>
    );
}
