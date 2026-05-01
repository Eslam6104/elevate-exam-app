"use client";
import Link from "next/link";
import { ReactNode } from "react";

type Breadcrumb = {
  label: string;
  href?: string;
};

type Props = {
  breadcrumbs: Breadcrumb[];
  title: string;
  actions?: ReactNode;
};

export function AdminViewHeader({ breadcrumbs, title, actions }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((bc, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {bc.href ? (
              <Link href={bc.href} className="text-gray-500 hover:underline">
                {bc.label}
              </Link>
            ) : (
              <span className="text-[#2B7FFF]">{bc.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && <span className="text-gray-400">/</span>}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center bg-white p-4 py-5 rounded-md shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
