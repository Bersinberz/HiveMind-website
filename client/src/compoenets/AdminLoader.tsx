interface AdminLoaderProps {
    isComponent?: boolean;
}

export default function AdminLoader({ isComponent = false }: AdminLoaderProps) {
    return (
        <div className={isComponent ? "w-full min-h-[400px] flex flex-col items-center justify-center" : "fixed inset-0 bg-[#050505]/90 backdrop-blur-md flex flex-col items-center justify-center z-[99999]"}>
            <style>{`
                .loader {
                    width: 50px;
                    aspect-ratio: 1;
                    --c: no-repeat radial-gradient(farthest-side, #FFC107 92%, #0000);
                    background: 
                        var(--c) 50%  0, 
                        var(--c) 50%  100%, 
                        var(--c) 100% 50%, 
                        var(--c) 0    50%;
                    background-size: 10px 10px;
                    animation: l18 1s infinite;
                    position: relative;
                    filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.6));
                }
                .loader::before {    
                    content: "";
                    position: absolute;
                    inset: 0;
                    margin: 3px;
                    background: repeating-conic-gradient(#0000 0 35deg, #FFC107 0 90deg);
                    -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 3px), #000 0);
                    mask-image: radial-gradient(farthest-side, #0000 calc(100% - 3px), #000 0);
                    border-radius: 50%;
                }
                @keyframes l18 { 
                    100% { transform: rotate(.5turn); }
                }
            `}</style>
            <div className="loader"></div>
        </div>
    );
}
