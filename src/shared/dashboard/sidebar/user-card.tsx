"use client";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function UserCard() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="p-4 border-t border-slate-700 mt-auto">
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-2"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}