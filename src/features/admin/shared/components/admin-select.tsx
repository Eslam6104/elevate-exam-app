"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder: string;
  clearOptionLabel?: string;
};

export function AdminSelect({ value, onChange, options, placeholder, clearOptionLabel }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative w-full text-sm" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-full items-center justify-between rounded-sm border border-gray-200 bg-white px-4 py-2 text-gray-500 outline-none focus:border-[#2B7FFF] transition-colors"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-md overflow-hidden">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${value === "" ? "bg-[#2B7FFF] text-white hover:bg-[#2B7FFF]" : "text-gray-600"}`}
          >
            {clearOptionLabel || placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 transition-colors ${value === opt.value ? "bg-[#2B7FFF] text-white hover:bg-[#2B7FFF]" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
