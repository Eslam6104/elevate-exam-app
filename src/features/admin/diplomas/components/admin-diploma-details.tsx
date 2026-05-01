import Image from "next/image";
import { Diploma } from "@/features/student/diplomas/types/diploma.types";

export function AdminDiplomaDetails({ diploma }: { diploma: Diploma }) {
  return (
    <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 space-y-8 mt-6">
      <div className="space-y-2">
        <div className="text-gray-400 text-sm font-medium">Image</div>
        {diploma.image ? (
          <Image 
            src={diploma.image} 
            alt={diploma.title} 
            width={300} 
            height={300} 
            className="rounded-md object-cover w-64 h-64 bg-gray-100" 
          />
        ) : (
          <div className="w-64 h-64 bg-gray-200 rounded-md"></div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-gray-400 text-sm font-medium">Title</div>
        <div className="text-base text-gray-900 font-medium">{diploma.title}</div>
      </div>

      <div className="space-y-1">
        <div className="text-gray-400 text-sm font-medium">Description</div>
        <div className="text-base text-gray-700 leading-relaxed max-w-5xl">
          {diploma.description}
        </div>
      </div>
    </div>
  );
}
