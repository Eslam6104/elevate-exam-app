"use client";
import { X, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function AdminConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Yes, clear",
  cancelText = "Cancel",
  isLoading = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-8 pb-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100/50">
            <AlertTriangle className="w-10 h-10 text-[#F44336]" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-[19px] font-semibold text-gray-900 leading-tight">
              {title}
            </h3>
            <p className="text-[14px] text-gray-500 font-medium">
              {description}
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-sm bg-[#ECEFF1] text-gray-600 font-semibold text-[15px] hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-sm bg-[#F44336] text-white font-semibold text-[15px] hover:bg-red-600 transition-colors shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
