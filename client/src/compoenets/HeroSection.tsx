import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
    settings?: {
        communityName: string;
        tagline?: string;
    } | null;
    showSplash?: boolean;
}

export default function HeroSection({ settings, showSplash }: HeroSectionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const hiveTargetRef = useRef<HTMLSpanElement>(null);
    const [gifLoaded, setGifLoaded] = useState(false);

    const communityName = settings?.communityName || "HiveMind";
    const tagline = settings?.tagline || "Artificial Intelligence Community";

    const splitName = (name: string) => {
        const spaceIdx = name.indexOf(" ");
        if (spaceIdx > 0) {
            return {
                first: name.substring(0, spaceIdx),
                second: name.substring(spaceIdx)
            };
        }
        for (let i = 1; i < name.length; i++) {
            const char = name[i];
            if (char === char.toUpperCase() && char !== char.toLowerCase()) {
                return {
                    first: name.substring(0, i),
                    second: name.substring(i)
                };
            }
        }
        const mid = Math.ceil(name.length / 2);
        return {
            first: name.substring(0, mid),
            second: name.substring(mid)
        };
    };

    const { first: firstPart, second: secondPart } = splitName(communityName);

    // ==========================================
    // TYPEWRITER EFFECT LOGIC
    // ==========================================
    const words = ["Computer Vision", "Machine Learning", "Neural Networks", "Generative AI"];
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typewriterText, setTypewriterText] = useState("");

    useEffect(() => {
        const currentWord = words[wordIndex % words.length];
        let timer: number;

        if (isDeleting) {
            timer = window.setTimeout(() => {
                setTypewriterText(currentWord.substring(0, charIndex - 1));
                setCharIndex((prev) => prev - 1);
            }, 50);
        } else {
            timer = window.setTimeout(() => {
                setTypewriterText(currentWord.substring(0, charIndex + 1));
                setCharIndex((prev) => prev + 1);
            }, 100);
        }

        if (!isDeleting && charIndex === currentWord.length) {
            clearTimeout(timer);
            timer = window.setTimeout(() => {
                setIsDeleting(true);
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            clearTimeout(timer);
            timer = window.setTimeout(() => {
                setIsDeleting(false);
                setWordIndex((prev) => prev + 1);
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, wordIndex]);

    // ==========================================
    // HIGH PERFORMANCE CANVAS ENGINE
    // ==========================================
    useEffect(() => {
        const canvas = canvasRef.current;
        const heroSection = heroRef.current;
        const hiveTarget = hiveTargetRef.current;
        if (!canvas || !heroSection || !hiveTarget) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let particles: Particle[] = [];
        let neuralNodes: NeuralNode[] = [];
        let packets: LightPacket[] = [];
        let hiveRect = { x: 0, y: 0, width: 0, height: 0 };

        const mouse = {
            x: null as number | null,
            y: null as number | null,
            radius: 120, // Interaction radius
        };

        const colors = ["#FFC107", "#FFD54F", "#FFFFFF"];

        function updateHiveRect() {
            if (!hiveTarget) return;
            const rect = hiveTarget.getBoundingClientRect();
            hiveRect = {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
            };
        }

        class Particle {
            x: number;
            y: number;
            size: number;
            baseX: number;
            baseY: number;
            density: number;
            color: string;
            vx: number;
            vy: number;
            alpha: number;
            alphaChange: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = Math.random() * 20 + 5;
                this.color = colors[Math.floor(Math.random() * colors.length)];

                // Movement vectors
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;

                // Twinkle effect
                this.alpha = Math.random();
                this.alphaChange = Math.random() * 0.02 + 0.005;
            }

            update() {
                // Slow floating movement
                this.x += this.vx;
                this.y += this.vy;

                // Screen wrap
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Twinkle logic
                this.alpha += this.alphaChange;
                if (this.alpha >= 1 || this.alpha <= 0.1) {
                    this.alphaChange *= -1;
                }

                // Mouse Interaction (Subtle Parallax / Repulsion)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const dirX = (dx / distance) * force * 0.5;
                        const dirY = (dy / distance) * force * 0.5;
                        this.x -= dirX;
                        this.y -= dirY;
                    }
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha * 0.6; // Keep particles subtle
                ctx.fill();
                ctx.globalAlpha = 1.0; // Reset
            }
        }

        class NeuralNode {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            vx: number;
            vy: number;
            brightness: number;
            active: boolean;
            toggleTimer: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.size = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.1;
                this.vy = (Math.random() - 0.5) * 0.1;
                this.brightness = 0.3; // Default low brightness
                this.active = Math.random() > 0.5;
                this.toggleTimer = Math.random() * 200;
            }

            update() {
                // Very slow drift around base position
                this.x += this.vx;
                this.y += this.vy;

                // Constrain drift
                if (Math.abs(this.x - this.baseX) > 10) this.vx *= -1;
                if (Math.abs(this.y - this.baseY) > 10) this.vy *= -1;

                // Randomly appear/disappear
                this.toggleTimer--;
                if (this.toggleTimer <= 0) {
                    this.active = !this.active;
                    this.toggleTimer = Math.random() * 200 + 100;
                }

                // Mouse interaction (Brighten nodes)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    if (Math.hypot(dx, dy) < mouse.radius) {
                        this.brightness = Math.min(this.brightness + 0.05, 1);
                    } else {
                        this.brightness = Math.max(this.brightness - 0.01, 0.3);
                    }
                }
            }

            draw() {
                if (!ctx) return;
                if (!this.active) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 193, 7, ${this.brightness})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#FFC107";
                ctx.fill();
                ctx.shadowBlur = 0; // Reset
            }
        }

        class LightPacket {
            start: NeuralNode;
            end: NeuralNode;
            progress: number;
            speed: number;

            constructor(startNode: NeuralNode, endNode: NeuralNode) {
                this.start = startNode;
                this.end = endNode;
                this.progress = 0;
                this.speed = Math.random() * 0.005 + 0.002;
            }

            update() {
                this.progress += this.speed;
            }

            draw() {
                if (!ctx) return;
                if (this.progress >= 1 || !this.start.active || !this.end.active) return;

                const curX = this.start.x + (this.end.x - this.start.x) * this.progress;
                const curY = this.start.y + (this.end.y - this.start.y) * this.progress;

                ctx.beginPath();
                ctx.arc(curX, curY, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = "#FFFFFF";
                ctx.shadowBlur = 8;
                ctx.shadowColor = "#FFFFFF";
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function initSystems() {
            particles = [];
            neuralNodes = [];
            packets = [];

            // 1. Generate Global Particles
            for (let i = 0; i < 350; i++) {
                particles.push(new Particle());
            }

            // 2. Generate Neural Nodes strictly around the "Hive" text
            const padding = 40;
            const startX = hiveRect.x - padding;
            const endX = hiveRect.x + hiveRect.width + padding;
            const startY = hiveRect.y - padding;
            const endY = hiveRect.y + hiveRect.height + padding;

            for (let i = 0; i < 40; i++) {
                const rx = startX + Math.random() * (endX - startX);
                const ry = startY + Math.random() * (endY - startY);
                neuralNodes.push(new NeuralNode(rx, ry));
            }
        }

        function drawNeuralConnections() {
            if (!ctx) return;
            packets = packets.filter((p) => p.progress < 1); // Clean finished packets

            for (let i = 0; i < neuralNodes.length; i++) {
                for (let j = i + 1; j < neuralNodes.length; j++) {
                    const n1 = neuralNodes[i];
                    const n2 = neuralNodes[j];

                    if (!n1.active || !n2.active) continue;

                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const distance = Math.hypot(dx, dy);

                    // If close enough, draw connection
                    if (distance < 70) {
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        // Line opacity based on distance
                        const opacity = 1 - distance / 70;
                        ctx.strokeStyle = `rgba(255, 193, 7, ${opacity * 0.3})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();

                        // Randomly spawn light packets traveling along this line
                        if (Math.random() < 0.001) {
                            packets.push(new LightPacket(n1, n2));
                        }
                    }
                }
            }
        }

        let animationFrameId: number;

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Update & Draw Global Particles
            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            // Update & Draw Neural Network
            drawNeuralConnections();

            neuralNodes.forEach((n) => {
                n.update();
                n.draw();
            });

            packets.forEach((p) => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        }

        // Boot Up
        const setupTimeout = setTimeout(() => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            updateHiveRect();
            initSystems();
            animate();
        }, 100);

        // Event Listeners
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            updateHiveRect();
            initSystems();
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Get mouse position relative to viewport
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // Modify text glow intensity based on mouse distance to center
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const distToCenter = Math.hypot(mouse.x - centerX, mouse.y - centerY);
            const maxDist = Math.max(centerX, centerY);

            // Closer to center = brighter glow
            const glowVal = Math.max(15, 40 - (distToCenter / maxDist) * 30);
            heroSection.style.setProperty("--glow-intensity", `${glowVal}px`);
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
            heroSection.style.setProperty("--glow-intensity", "15px");
        };

        window.addEventListener("resize", handleResize);
        heroSection.addEventListener("mousemove", handleMouseMove);
        heroSection.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            clearTimeout(setupTimeout);
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            heroSection.removeEventListener("mousemove", handleMouseMove);
            heroSection.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [communityName]);

    return (
        <section
            className="relative w-screen h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat bg-fixed z-[1]"
            id="hero-section"
            ref={heroRef}
            style={{ backgroundImage: "url('/assets/hero-bg.png')" }}
        >
            <div className="absolute inset-0 bg-[#040406]/75 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-[2]"></div>

            <img
                src="/assets/bee_background.gif"
                alt="Center Atmospheric GIF"
                onLoad={() => setGifLoaded(true)}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] max-w-[200vw] h-auto z-[3] pointer-events-none mix-blend-screen center-bg-gif-mask transition-opacity duration-1000 ${
                    gifLoaded ? "opacity-85" : "opacity-0"
                }`}
            />

            <div className="absolute w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(255,193,7,0.08)_0%,transparent_60%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-[3] pointer-events-none animate-[pulseGlowBg_6s_ease-in-out_infinite_alternate]"></div>
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[10px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,rgba(255,213,79,0.1)_40%,transparent_70%)] blur-[4px] z-[3] pointer-events-none"></div>

            <canvas id="fx-canvas" ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-[4] pointer-events-none"></canvas>

            {/* Centered Typography Content */}
            <motion.div
                className="relative z-[5] text-center select-none"
                initial="hidden"
                whileInView={showSplash ? "hidden" : "visible"}
                viewport={{ once: false, amount: 0.15 }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.25
                        }
                    }
                }}
            >
                <motion.h1
                    variants={{
                        hidden: {
                            opacity: 0,
                            scale: 0.9,
                            y: 40,
                            rotateX: -20,
                            filter: "blur(15px)"
                        },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            rotateX: 0,
                            filter: "blur(0px)",
                            transition: {
                                duration: 1.5,
                                ease: [0.075, 0.82, 0.165, 1]
                            }
                        }
                    }}
                    style={{ perspective: 500 }}
                    className="text-[clamp(2.5rem,8vw,8rem)] font-black tracking-tighter leading-[1.1] mb-6 uppercase transition-[filter] duration-800 ease-out filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] drop-shadow-[0_0_var(--glow-intensity)_rgba(255,193,7,0.4)]"
                    id="main-heading"
                >
                    {/* Spans split for targeted canvas effects */}
                    <span className="gold-sweep-text" id="hive-target" ref={hiveTargetRef}>
                        {firstPart}
                    </span>
                    <span className="hollow-glow-text">{secondPart}</span>
                </motion.h1>
                <motion.h2
                    variants={{
                        hidden: {
                            opacity: 0,
                            scale: 0.9,
                            y: 20,
                            rotateX: -20,
                            filter: "blur(10px)"
                        },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            rotateX: 0,
                            filter: "blur(0px)",
                            transition: {
                                duration: 1.2,
                                ease: [0.075, 0.82, 0.165, 1]
                            }
                        }
                    }}
                    style={{ perspective: 500 }}
                    className="relative inline-block text-[clamp(0.75rem,1.3vw,1.1rem)] font-bold text-[#E5E5E5] tracking-[0.3em] uppercase subheading-lines"
                >
                    {tagline}
                </motion.h2>

                {/* Typewriter Effect Container */}
                <motion.div
                    variants={{
                        hidden: {
                            opacity: 0,
                            scale: 0.9,
                            y: 20,
                            rotateX: -20,
                            filter: "blur(10px)"
                        },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            rotateX: 0,
                            filter: "blur(0px)",
                            transition: {
                                duration: 1.2,
                                ease: [0.075, 0.82, 0.165, 1]
                            }
                        }
                    }}
                    style={{ perspective: 500 }}
                    className="mt-6 text-[clamp(1rem,2vw,1.3rem)] font-medium text-white tracking-widest"
                >
                    We explore <span className="text-gold-primary font-bold drop-shadow-[0_0_10px_rgba(255,193,7,0.4)]">{typewriterText}</span>
                    <span className="text-gold-primary font-bold cursor-blink">|</span>
                </motion.div>
            </motion.div>
        </section>
    );
}
