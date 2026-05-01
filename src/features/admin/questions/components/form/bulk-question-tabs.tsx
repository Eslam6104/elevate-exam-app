"use client";
import { Plus, X } from "lucide-react";

interface Props {
  count: number;
  activeId: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function BulkQuestionTabs({ count, activeId, onSelect, onAdd, onRemove }: Props) {
  return (
    <div className="flex items-center gap-px bg-gray-100 p-px rounded-sm overflow-x-auto no-scrollbar border-b border-gray-200">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className={`flex items-center relative min-w-15 h-10 px-4 text-xs font-bold cursor-pointer transition-colors ${activeId === i ? 'bg-white text-[#2B7FFF] shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}
          onClick={() => onSelect(i)}
        >
          <span className="flex-1 text-center">Q{i + 1}</span>
          {count > 1 && (
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(i); }}
              className={`absolute top-1 right-1 p-0.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors ${activeId === i ? 'text-gray-300' : 'text-gray-300'}`}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      ))}
      <button 
        type="button" 
        onClick={onAdd}
        className="h-10 px-4 text-gray-400 hover:text-[#2B7FFF] hover:bg-white transition-all flex items-center justify-center bg-gray-50"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
