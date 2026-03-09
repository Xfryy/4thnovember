"use client";

import { useState } from "react";
import GameBackground from "./GameBackground";
import CharacterSprite from "../components/Charactersprite";

interface CharacterNameInputProps {
  isLoading: boolean;
  onSubmit: (name: string) => void;
}

export default function CharacterNameInput({ isLoading, onSubmit }: CharacterNameInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      alert("Nama karakter tidak boleh kosong!");
      return;
    }
    onSubmit(inputValue.trim());
  };

  return (
    <div className="w-full h-screen relative flex items-center justify-center p-4">
      <GameBackground />

      <div
        className="relative z-10 rounded-2xl p-8 max-w-md w-full"
        style={{
          background: "rgba(10, 6, 24, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(139,92,246,0.25)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.1)",
        }}
      >
        <h2
          className="text-3xl font-bold text-center mb-2"
          style={{
            background: "linear-gradient(135deg, #f9a8d4, #a5b4fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          4th November
        </h2>
        <p className="text-center text-purple-400 mb-6 text-sm">
          Selamat datang! Masukkan nama karakter Anda
        </p>

        {/* Sprite */}
        <div className="flex justify-center mb-6">
          <CharacterSprite
            compact
            width={150}
            height={200}
            animated
          />
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-purple-300 mb-2">
            Nama Karakter
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Masukkan nama Anda"
            className="w-full px-4 py-2 rounded-lg focus:outline-none text-white placeholder-purple-600"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.35)",
            }}
            disabled={isLoading}
            autoFocus
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !inputValue.trim()}
          className="w-full text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #ec4899, #a855f7)",
            boxShadow: "0 0 20px rgba(236,72,153,0.35)",
          }}
        >
          {isLoading ? "Setting..." : "Mulai Game"}
        </button>
      </div>
    </div>
  );
}
