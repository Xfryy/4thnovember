import { useEffect } from "react";
import GameBackground from "./GameBackground";

export default function LoadingScreen() {

  useEffect(() => {
    const calculateEffectiveHeight = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return h > w ? w : h;
    };
    
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${calculateEffectiveHeight() * 0.01}px`);
    };
    
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  return (
    <div 
      className="w-full relative flex items-center justify-center overflow-hidden"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <style jsx>{`
        @keyframes loadingPulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale3d(1, 1, 1);
          }
          50% {
            opacity: 1;
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        
        @keyframes loadingSpin {
          from {
            transform: rotate(0deg) translateZ(0);
          }
          to {
            transform: rotate(360deg) translateZ(0);
          }
        }
        
        @keyframes loadingFadeIn {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        @keyframes loadingGlow {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(236,72,153,0.6));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(236,72,153,0.9));
          }
        }
        
        .loading-container {
          animation: loadingFadeIn 0.5s ease-out forwards;
          will-change: transform, opacity;
        }
        
        .loading-spinner {
          animation: loadingSpin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }
        
        .loading-pulse {
          animation: loadingPulse 1.5s ease-in-out infinite,
                     loadingGlow 2s ease-in-out infinite;
          will-change: transform, filter, opacity;
        }
      `}</style>
      
      <GameBackground />
      
      <div className="relative z-10 text-center loading-container">
        <div className="relative">
          {/* Spinner with glow */}
          <div className="loading-spinner inline-block rounded-full h-12 w-12 
                        border-2 border-pink-400/30 border-t-pink-400 
                        border-r-pink-400/80 relative">
            <div className="absolute inset-0 rounded-full 
                          bg-gradient-to-r from-pink-500/20 to-purple-500/20 
                          blur-xl -z-10 loading-pulse" />
          </div>
          
          {/* Inner dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        w-2 h-2 bg-pink-400 rounded-full loading-pulse" />
        </div>
        
        <p className="mt-6 text-pink-300 font-semibold tracking-[0.3em] 
                     text-sm uppercase relative">
          Loading...
          <span className="absolute -bottom-1 left-0 right-0 h-px 
                         bg-gradient-to-r from-transparent via-pink-400/50 
                         to-transparent" />
        </p>
        
        <p className="mt-2 text-xs text-purple-400/60 tracking-wider 
                      animate-pulse">
           Please wait and be patient..
        </p>
      </div>
      
      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .loading-spinner {
            width: 40px;
            height: 40px;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .loading-spinner {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  );
}