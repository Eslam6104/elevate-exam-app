"use client";

import SidebarItem from "./sidebar-item";
import UserCard from "./user-card";

type SidebarItemType = {
  label: string;
  href: string;
  icon: "graduation" | "user" | "exams" | "logs";
};

type Props = {
  items: readonly SidebarItemType[];
  variant?: "student" | "admin";
};

export default function Sidebar({ items, variant = "student" }: Props) {
  const isStudent = variant === "student";

  return (
    <aside
      className={`
        w-65 min-h-screen flex flex-col justify-between
        ${isStudent ? "bg-[#F3F6FB]" : "bg-slate-900 text-white"}
      `}
    >
      {/* top */}
      <div>

        {/* logo */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-3xl font-bold tracking-wider">
            Elevate
          </h1>

          <p className="text-sm text-gray-500">
            Exam App
          </p>
        </div>

        {/* navigation */}
        <nav className="flex flex-col gap-2 px-4">
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              variant={variant}
            />
          ))}
        </nav>

      </div>

      {/* user */}
      <UserCard />
    </aside>
  );
}