"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import GameBackground from "@/components/StartMenu/components/GameBackground";

const ADMIN_EMAIL = "faricandra5@gmail.com";

interface UserProfile {
  uid: string;
  email: string;
  characterName: string;
  createdAt: number;
  lastPlayed: number;
  totalPlayTime: number; // in minutes/seconds? Usually minutes based on your code
  totalPlays: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      if (user.email !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }

      setIsAuthenticated(true);
      fetchUsers();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as UserProfile);
      });

      // Sort by newest first
      usersData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPlayTime = (minutes: number) => {
    if (!minutes) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="w-full h-screen relative flex items-center justify-center bg-[#0a0618]">
        <GameBackground />
        <div className="relative z-10 text-pink-400 animate-pulse tracking-widest uppercase text-sm">
          Loading Admin Data...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative bg-[#0a0618] text-white overflow-y-auto">
      <GameBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500 mb-2">
              System Administrator
            </h1>
            <p className="text-purple-400/60 text-sm tracking-widest uppercase">
              Player Database Overview
            </p>
          </div>
          
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-2.5 rounded-xl border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition-all font-bold text-sm"
          >
            ← Back to Game
          </button>
        </div>

        {/* Stats Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-[#110a26]/80 border border-purple-500/20 backdrop-blur-xl">
            <h3 className="text-purple-400/60 text-xs uppercase tracking-widest mb-1">Total Players</h3>
            <p className="text-3xl font-black text-white">{users.length}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#110a26]/80 border border-purple-500/20 backdrop-blur-xl">
            <h3 className="text-purple-400/60 text-xs uppercase tracking-widest mb-1">Total Play Sessions</h3>
            <p className="text-3xl font-black text-white">
              {users.reduce((acc, user) => acc + (user.totalPlays || 0), 0)}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#110a26]/80 border border-purple-500/20 backdrop-blur-xl">
            <h3 className="text-purple-400/60 text-xs uppercase tracking-widest mb-1">Combined Playtime</h3>
            <p className="text-3xl font-black text-white">
              {formatPlayTime(users.reduce((acc, user) => acc + (user.totalPlayTime || 0), 0))}
            </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-white/10 bg-[#0e0820]/90 backdrop-blur-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-purple-400/70 tracking-wider uppercase">Player</th>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400/70 tracking-wider uppercase">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400/70 tracking-wider uppercase">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400/70 tracking-wider uppercase">Last Seen</th>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400/70 tracking-wider uppercase text-right">Time Logged</th>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400/70 tracking-wider uppercase text-right">Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                          <span className="text-xs font-bold text-white">
                            {user.characterName?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-sm text-pink-100">{user.characterName || "Unnamed Player"}</div>
                          <div className="text-[10px] text-white/30 font-mono mt-0.5">{user.uid.slice(0,8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{user.email || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">{formatDate(user.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">{formatDate(user.lastPlayed)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                        {formatPlayTime(user.totalPlayTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-gray-300">{user.totalPlays || 0}</div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No users found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
