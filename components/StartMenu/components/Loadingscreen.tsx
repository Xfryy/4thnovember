import GameBackground from "./GameBackground";

export default function LoadingScreen() {
  return (
    <div className="w-full h-screen relative flex items-center justify-center overflow-hidden">
      <style jsx>{`
        @keyframes loadingPulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        @keyframes loadingSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes loadingFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes loadingGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(236,72,153,0.6));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(236,72,153,0.9));
          }
        }
        
        .loading-container {
          animation: loadingFadeIn 0.5s ease-out forwards;
        }
        
        .loading-spinner {
          animation: loadingSpin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        .loading-pulse {
          animation: loadingPulse 1.5s ease-in-out infinite,
                     loadingGlow 2s ease-in-out infinite;
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
          memasuki dunia 4th November...
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