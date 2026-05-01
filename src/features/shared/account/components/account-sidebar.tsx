"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Lock, LogOut } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import { signOut } from "next-auth/react";

export function AccountSidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const basePath = isAdmin ? "/admin" : "/student";

  const links = [
    { href: `${basePath}/account/profile`, label: "Profile", icon: User },
    { href: `${basePath}/account/password`, label: "Change Password", icon: Lock },
  ];

  return (
    <div className="flex flex-col justify-between h-full w-full max-w-62.5 min-h-125">
      <div className="flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors w-full"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}
