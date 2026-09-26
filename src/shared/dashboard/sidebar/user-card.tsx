"use client";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

interface UserCardProps {
  variant?: "student" | "admin";
}

export default function UserCard({ variant = "student" }: UserCardProps) {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  const isStudent = variant === "student";

  return (
    <div
      className={`p-4 border-t mt-auto transition-colors ${
        isStudent
          ? "border-gray-200 bg-white/50"
          : "border-slate-800 bg-slate-950/40"
      }`}
    >
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#2B7FFF] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs">
            {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold truncate ${
                isStudent ? "text-gray-900" : "text-white"
              }`}
            >
              {user.firstName} {user.lastName}
            </p>
            <p
              className={`text-xs truncate ${
                isStudent ? "text-gray-500" : "text-slate-400"
              }`}
            >
              {user.email}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`p-2 rounded-lg transition-colors ml-2 ${
            isStudent
              ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
              : "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          }`}
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}