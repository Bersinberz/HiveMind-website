import { useState } from "react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-black/40 backdrop-blur-md border-b border-white/5 shadow-2xl transition-all duration-300">
            {/* Logo */}
            <a href="#" className="group flex items-center no-underline cursor-pointer">
                <img
                    src="/assets/HiveMind-Logo.png"
                    alt="HiveMind Logo"
                    className="h-10 w-auto md:h-14 filter drop-shadow-[0_0_12px_rgba(255,193,7,0.4)] transition-transform duration-500 group-hover:scale-108 group-hover:rotate-3"
                />
            </a>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex gap-9 list-none">
                <li className="nav-link-item">
                    <a
                        href="/home"
                        className="relative text-white/70 hover:text-gold-primary hover:drop-shadow-[0_0_8px_rgba(255,193,7,0.4)] no-underline text-sm font-semibold tracking-widest uppercase transition-all duration-300 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-gold-light after:to-gold-primary after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300 after:ease-out after:shadow-[0_0_6px_#FFC107]"
                    >
                        Home
                    </a>
                </li>
                <li className="nav-link-item">
                    <a
                        href="#projects"
                        className="relative text-white/70 hover:text-gold-primary hover:drop-shadow-[0_0_8px_rgba(255,193,7,0.4)] no-underline text-sm font-semibold tracking-widest uppercase transition-all duration-300 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-gold-light after:to-gold-primary after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300 after:ease-out after:shadow-[0_0_6px_#FFC107]"
                    >
                        Projects
                    </a>
                </li>
                <li className="nav-link-item">
                    <a
                        href="#team"
                        className="relative text-white/70 hover:text-gold-primary hover:drop-shadow-[0_0_8px_rgba(255,193,7,0.4)] no-underline text-sm font-semibold tracking-widest uppercase transition-all duration-300 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-gold-light after:to-gold-primary after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300 after:ease-out after:shadow-[0_0_6px_#FFC107]"
                    >
                        Team
                    </a>
                </li>
                <li className="nav-link-item">
                    <a
                        href="#blog"
                        className="relative text-white/70 hover:text-gold-primary hover:drop-shadow-[0_0_8px_rgba(255,193,7,0.4)] no-underline text-sm font-semibold tracking-widest uppercase transition-all duration-300 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-gold-light after:to-gold-primary after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300 after:ease-out after:shadow-[0_0_6px_#FFC107]"
                    >
                        Blog
                    </a>
                </li>
                <li className="nav-link-item">
                    <a
                        href="#events"
                        className="relative text-white/70 hover:text-gold-primary hover:drop-shadow-[0_0_8px_rgba(255,193,7,0.4)] no-underline text-sm font-semibold tracking-widest uppercase transition-all duration-300 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-gold-light after:to-gold-primary after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300 after:ease-out after:shadow-[0_0_6px_#FFC107]"
                    >
                        Events
                    </a>
                </li>
            </ul>

            {/* Desktop Join Button */}
            <a href="#join" className="hidden lg:block no-underline">
                <button className="relative overflow-hidden bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none px-6 py-2.5 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.35)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_6px_22px_rgba(255,193,7,0.5),_0_0_10px_rgba(255,255,255,0.2)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(255,193,7,0.4)] before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 hover:before:left-[100%]">
                    Join HiveMind
                </button>
            </a>

            {/* Mobile Hamburger Button */}
            <button
                onClick={toggleMobileMenu}
                className="lg:hidden text-white hover:text-gold-primary transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle Mobile Menu"
            >
                {isMobileMenuOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                )}
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-b border-white/5 flex flex-col gap-6 py-8 px-6 lg:hidden animate-[fadeIn_0.3s_ease-out]">
                    <ul className="flex flex-col gap-5 list-none">
                        <li>
                            <a
                                href="/home"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white/85 hover:text-gold-primary text-sm font-semibold tracking-widest uppercase transition-colors"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#projects"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white/85 hover:text-gold-primary text-sm font-semibold tracking-widest uppercase transition-colors"
                            >
                                Projects
                            </a>
                        </li>
                        <li>
                            <a
                                href="#team"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white/85 hover:text-gold-primary text-sm font-semibold tracking-widest uppercase transition-colors"
                            >
                                Team
                            </a>
                        </li>
                        <li>
                            <a
                                href="#blog"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white/85 hover:text-gold-primary text-sm font-semibold tracking-widest uppercase transition-colors"
                            >
                                Blog
                            </a>
                        </li>
                        <li>
                            <a
                                href="#events"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white/85 hover:text-gold-primary text-sm font-semibold tracking-widest uppercase transition-colors"
                            >
                                Events
                            </a>
                        </li>
                    </ul>
                    <a href="#join" onClick={() => setIsMobileMenuOpen(false)} className="w-full no-underline">
                        <button className="relative w-full overflow-hidden bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-3 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.35)]">
                            Join HiveMind
                        </button>
                    </a>
                </div>
            )}
        </nav>
    );
}
