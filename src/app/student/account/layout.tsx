import { ChevronLeft, UserCircle } from "lucide-react";
import Link from "next/link";
import { AccountSidebar } from "@/features/shared/account/components/account-sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b">
        <Link 
          href="/student/diplomas" 
          className="p-4 hover:bg-gray-50 border-r flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1 bg-blue-600 p-4 flex items-center gap-3 text-white">
          <UserCircle className="w-6 h-6" />
          <h2 className="text-xl font-medium">Account Settings</h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col md:flex-row flex-1 p-6 gap-8">
        <AccountSidebar />
        <div className="flex-1 max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
}
