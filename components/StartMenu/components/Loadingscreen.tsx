import GameBackground from "./GameBackground";

export default function LoadingScreen() {
  return (
    <div className="w-full h-screen relative flex items-center justify-center">
      <GameBackground />
      <div className="relative z-10 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400" />
        <p className="mt-4 text-pink-300 font-semibold tracking-widest text-sm uppercase">
          Loading...
        </p>
      </div>
    </div>
  );
}
