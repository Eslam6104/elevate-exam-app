"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, CloudUpload, Download, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImageApi } from "@/shared/lib/apis/upload-image.api";

type Props = {
  value?: string; // URL from backend
  onChange: (val: string) => void;
};

export function ImageUploadDropzone({ value, onChange }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size?: string } | null>(null);

  useEffect(() => {
    if (!value || typeof value !== 'string') {
      setFileMeta(null);
      setLocalPreview(null);
    } else if (value && !fileMeta) {
      const parts = value.split("/");
      const extractedName = parts[parts.length - 1]?.split("?")[0] || "image.png";
      setFileMeta({ name: extractedName });
    }
  }, [value, fileMeta]);

  const getDisplayUrl = () => {
    if (localPreview) return localPreview;
    if (!value || typeof value !== 'string') return "";
    if (value.startsWith("http") || value.startsWith("blob:") || value.startsWith("data:")) return value;
    
    // Construct full URL from relative backend path
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://exam-app.elevate-bootcamp.cloud/api";
    const origin = baseUrl.replace(/\/api\/?$/, "");
    return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isUploading) return;
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Image size must be less than 1 MB");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Set local preview instantly
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setFileMeta({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });

    setIsUploading(true);
    try {
      const res = await uploadImageApi(file);
      const data = res.data;
      
      // Attempt to extract the URL from various possible response shapes
      let url = "";
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          url = parsed.url || parsed.link || parsed.payload?.url || parsed.data?.url;
        } catch {
          url = data; // fallback if it's a raw string
        }
      } else if (typeof data === "object" && data !== null) {
        url = data.url || data.link || data.payload?.url || data.data?.url || data.image;
      }

      if (url && typeof url === "string") {
        onChange(url);
      } else {
        console.error("Unknown upload response structure:", data);
        throw new Error("Could not extract image URL from response");
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image. Please try again.");
      setLocalPreview(null);
      setFileMeta(null);
      onChange("");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    onChange("");
    setFileMeta(null);
    setLocalPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayUrl = getDisplayUrl();

  return (
    <div className="space-y-2">
      <div className="text-[15px] font-medium text-gray-700">Image</div>
      
      <div 
        className={`relative border border-gray-200 rounded-sm p-4 transition-colors ${dragActive ? 'bg-blue-50 border-[#2B7FFF]' : 'bg-white hover:bg-gray-50'} ${(!value && !isUploading) ? 'cursor-pointer' : ''} ${isUploading ? 'opacity-80' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => (!value && !isUploading) && inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={handleChange}
          disabled={isUploading}
        />

        {!(typeof value === "string" && value.trim() !== "") && !localPreview ? (
          <div className="flex items-center w-full min-h-30">
            <div className="w-16 flex justify-center border-r border-gray-100 mr-4 pr-4">
              <ImageIcon className="w-10 h-10 text-gray-200" strokeWidth={1} />
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-500">
              <CloudUpload className="w-5 h-5 text-gray-400" />
              <span>Drop an image here or <span className="text-[#2B7FFF]">select from your computer</span></span>
            </div>
          </div>
        ) : (
          <div className="flex items-center w-full gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <Image 
                src={displayUrl} 
                alt="Uploaded preview" 
                fill
                className={`object-cover rounded-sm border border-gray-200 shadow-sm transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-sm">
                  <Loader2 className="w-6 h-6 text-[#2B7FFF] animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1 flex items-center justify-between min-w-0">
              <div className="flex items-center gap-4 text-sm text-gray-500 min-w-0 pr-4">
                <span className="truncate">{fileMeta?.name || "image.png"}</span>
                {fileMeta?.size && <span className="text-gray-400 shrink-0">{fileMeta.size}</span>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  type="button" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (displayUrl) window.open(displayUrl, "_blank"); 
                  }}
                  className="p-2 text-[#2B7FFF] hover:bg-blue-50 rounded-sm disabled:opacity-50"
                  disabled={isUploading}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={handleRemove} 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-sm disabled:opacity-50"
                  disabled={isUploading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
