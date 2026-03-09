"use client";

import GameBackground from "./GameBackground";
import CharacterSprite from "../components/Charactersprite";

interface LoginScreenProps {
  isLoading: boolean;
  onLogin: () => void;
}

export default function LoginScreen({ isLoading, onLogin }: LoginScreenProps) {
  return (
    <div className="w-full h-screen relative flex items-center justify-center p-4">
      <GameBackground />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12">

        {/* Left: Title & Login */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight">
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              4th
            </span>
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #a5b4fc, #818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              November
            </span>
          </h1>
          <p className="text-purple-300 text-lg mb-8 tracking-wide">
            A visual novel experience
          </p>

          <button
            onClick={onLogin}
            disabled={isLoading}
            className="relative overflow-hidden text-white font-bold py-4 px-8 rounded-xl text-lg transition-all mb-4 disabled:opacity-50 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #ec4899, #a855f7)",
              boxShadow: "0 0 24px rgba(236,72,153,0.4), 0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            {isLoading ? "Logging in..." : "LOGIN WITH GOOGLE"}
          </button>

          <p className="text-sm text-purple-400 mt-4">
            Login untuk melanjutkan perjalanan Anda
          </p>
        </div>

        {/* Right: Character */}
        <div className="flex-1 flex justify-center">
          <CharacterSprite
            compact
            width={300}
            height={500}
            animated={false}
          />
        </div>

      </div>
    </div>
  );
}
