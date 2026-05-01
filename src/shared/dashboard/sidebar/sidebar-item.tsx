"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, User, BookOpen, List } from "lucide-react";

type Props = {
  item: {
    label: string;
    href: string;
    icon?: string;
  };
  variant?: "student" | "admin";
};

const iconMap: Record<string, any> = {
  graduation: GraduationCap,
  user: User,
  exams: BookOpen,
  logs: List,
};

export default function SidebarItem({ item, variant = "student" }: Props) {

  const pathname = usePathname();
  const active = pathname.startsWith(item.href);

  const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : GraduationCap;

  const base =
    "flex items-center gap-[10px] px-4 py-3 text-[15px] rounded-md transition-all";

  const studentActive =
    "bg-[#DBEAFE] border border-[#2B7FFF] text-[#155DFC]";

  const studentInactive =
    "text-gray-500 hover:bg-gray-100 border border-transparent";

  const adminActive =
    "bg-blue-600 text-white";

  const adminInactive =
    "text-gray-300 hover:bg-slate-800";

  const isStudent = variant === "student";

  return (
    <Link
      href={item.href}
      prefetch={false}
      className={`${base} ${
        isStudent
          ? active
            ? studentActive
            : studentInactive
          : active
          ? adminActive
          : adminInactive
      }`}
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </Link>
  );
}