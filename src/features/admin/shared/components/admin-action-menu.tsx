"use client";
import { useState } from "react";
import { MoreHorizontal, LucideIcon } from "lucide-react";

export type ActionOption = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isDestructive?: boolean;
};

type Props = {
  actions: ActionOption[];
};

export function AdminActionMenu({ actions }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }} 
        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500" />
      </button>
      
      {open && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          ></div>
          <div 
            className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-gray-50 z-20 text-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {actions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button 
                  key={action.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                    setOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2.5 text-left hover:bg-gray-50 gap-3 ${i !== 0 ? 'border-t' : ''} ${action.isDestructive ? 'text-red-600' : 'text-gray-700'}`}
                >
                  <Icon className={`w-4 h-4 ${action.isDestructive ? '' : (i === 0 ? 'text-emerald-500' : 'text-blue-500')}`} /> 
                  {action.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
