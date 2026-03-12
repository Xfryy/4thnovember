"use client";

import { useState, useEffect } from "react";
import GameBackground from "./GameBackground";
import CharacterSprite from "../components/Charactersprite";

interface CharacterNameInputProps {
  isLoading: boolean;
  onSubmit: (name: string) => void;
}

export default function CharacterNameInput({ isLoading, onSubmit }: CharacterNameInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      alert("Nama karakter tidak boleh kosong!");
      return;
    }
    onSubmit(inputValue.trim());
  };

  return (
    <div className="w-full h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes inputPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(236,72,153,0.3);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(236,72,153,0.2);
          }
        }
        
        @keyframes buttonPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(236,72,153,0.35);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 30px rgba(236,72,153,0.5);
          }
        }
        
        .character-container {
          animation: fadeInScale 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        
        .character-title {
          animation: slideInLeft 0.5s ease-out 0.1s both;
        }
        
        .character-sprite {
          animation: slideInRight 0.5s ease-out 0.1s both;
        }
        
        .character-input {
          animation: slideInLeft 0.5s ease-out 0.2s both;
        }
        
        .character-button {
          animation: slideInLeft 0.5s ease-out 0.3s both;
        }
        
        .input-focus {
          animation: inputPulse 2s ease-in-out infinite;
        }
      `}</style>
      
      <GameBackground />

      <div
        className="character-container relative z-10 rounded-2xl p-6 md:p-8 max-w-md w-full"
        style={{
          background: "rgba(10, 6, 24, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(139,92,246,0.3)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.15)",
        }}
      >
        <h2
          className="character-title text-2xl md:text-3xl font-bold text-center mb-2"
          style={{
            background: "linear-gradient(135deg, #f9a8d4, #a5b4fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          4th November
        </h2>
        <p className="character-title text-center text-purple-400/80 mb-4 md:mb-6 text-xs md:text-sm">
          Selamat datang! Masukkan nama karakter Anda
        </p>

        {/* Sprite */}
        <div className="character-sprite flex justify-center mb-4 md:mb-6">
          <CharacterSprite
            compact
            width={isMobile ? 120 : (isTablet ? 140 : 150)}
            height={isMobile ? 160 : (isTablet ? 180 : 200)}
            animated
          />
        </div>

        {/* Input */}
        <div className="character-input mb-4 md:mb-6">
          <label className="block text-xs md:text-sm font-semibold text-purple-300 mb-2">
            Nama Karakter
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Masukkan nama Anda"
            className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg focus:outline-none 
                       text-white placeholder-purple-600/70 transition-all duration-300
                       ${isFocused ? 'input-focus' : ''}`}
            style={{
              background: "rgba(139,92,246,0.12)",
              border: isFocused 
                ? "2px solid rgba(236,72,153,0.6)" 
                : "1px solid rgba(139,92,246,0.4)",
              fontSize: isMobile ? "14px" : "16px",
            }}
            disabled={isLoading}
            autoFocus
          />
          {isFocused && (
            <p className="text-[10px] md:text-xs text-purple-400/60 mt-1 ml-1">
              Tekan Enter untuk melanjutkan
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !inputValue.trim()}
          className="character-button w-full text-white font-bold py-2.5 md:py-3 
                     rounded-xl transition-all hover:scale-105 active:scale-95 
                     disabled:opacity-40 disabled:hover:scale-100 relative overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, #ec4899, #a855f7)",
            boxShadow: "0 0 20px rgba(236,72,153,0.35)",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent 
                        via-white/20 to-transparent -translate-x-full 
                        group-hover:translate-x-full transition-transform 
                        duration-700 ease-in-out" />
          
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Setting...</span>
            </span>
          ) : (
            "Mulai Game"
          )}
        </button>
        
        {/* Hint text */}
        <p className="text-center text-[10px] md:text-xs text-purple-500/50 mt-4 
                      animate-pulse">
          ✦ Nama ini akan terlihat oleh pemain lain ✦
        </p>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 
                    bg-gradient-to-r from-pink-500/20 to-purple-500/20 
                    rounded-full blur-3xl animate-pulse" />
      <div className="absolute -top-20 -right-20 w-64 h-64 
                    bg-gradient-to-l from-purple-500/20 to-pink-500/20 
                    rounded-full blur-3xl animate-pulse animation-delay-1000" />
    </div>
  );
}