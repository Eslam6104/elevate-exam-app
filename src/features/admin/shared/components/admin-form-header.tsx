import Link from "next/link";
import { X, Save } from "lucide-react";
import { ReactNode } from "react";

type Breadcrumb = {
  label: string;
  href?: string;
};

type Props = {
  breadcrumbs: Breadcrumb[];
  onCancelHref?: string;
  isSubmitting?: boolean;
};

export function AdminFormHeader({ breadcrumbs, onCancelHref, isSubmitting }: Props) {
  return (
    <div className="flex justify-between items-center bg-white p-4 py-5 border-b border-gray-100">
      <div className="flex items-center gap-2 text-sm font-medium">
        {breadcrumbs.map((bc, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {bc.href ? (
              <Link href={bc.href} className="text-gray-500 hover:text-gray-700 transition-colors">
                {bc.label}
              </Link>
            ) : (
              <span className="text-[#2B7FFF]">{bc.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && <span className="text-gray-300">/</span>}
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-3">
        {onCancelHref && (
          <Link 
            href={onCancelHref}
            className="flex items-center gap-2 px-5 py-2 bg-[#E2E8F0] hover:bg-gray-300 transition-colors text-gray-700 rounded-sm font-medium text-sm"
          >
            <X className="w-4 h-4" /> Cancel
          </Link>
        )}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2 bg-[#00D084] hover:bg-emerald-500 disabled:opacity-50 transition-colors text-white rounded-sm font-medium text-sm shadow-sm"
        >
          <Save className="w-4 h-4" /> Save
        </button>
      </div>
    </div>
  );
}
