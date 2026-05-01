"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isProtectedRoute = pathname.startsWith("/student") || pathname.startsWith("/admin");
    
    if (isProtectedRoute && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, pathname, router]);

  return <>{children}</>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionGuard>
        {children}
      </SessionGuard>
    </SessionProvider>
  );
}
