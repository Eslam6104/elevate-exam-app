"use client";

import Link from "next/link";
import { Diploma } from "../types/diploma.types";

interface DiplomaCardProps {
  diploma: Diploma;
}

export default function DiplomaCard({ diploma }: DiplomaCardProps) {
  return (
    <Link href={`/student/diplomas/${diploma.id}`} className="group block w-full h-full">
      <div className="relative overflow-hidden rounded-xl aspect-3/4 bg-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">

        {/* Background Image */}
        {/* Using a standard img tag to prevent unconfigured hostname errors with next/image */}
        <img
          src={diploma.image || "/placeholder-image.jpg"}
          alt={diploma.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x500?text=No+Image";
          }}
        />

        {/* Bottom Overlay matching design */}
        <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 p-5 flex flex-col justify-end border-t border-white/10 max-h-full overflow-y-auto font-mono">
          <h3 className="text-white font-bold text-2xl mb-3">
            {diploma.title}
          </h3>
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
            {diploma.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
