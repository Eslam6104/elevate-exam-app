"use client";
import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import { Diploma } from "@/features/student/diplomas/types/diploma.types";
import { useRouter, useSearchParams } from "next/navigation";

function ActionMenu({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
        <MoreHorizontal className="w-4 h-4 text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border z-10 text-sm overflow-hidden">
          <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 gap-3"><Eye className="w-4 h-4 text-emerald-500"/> View</button>
          <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 gap-3 border-y"><Edit className="w-4 h-4 text-blue-500"/> Edit</button>
          <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 gap-3"><Trash2 className="w-4 h-4"/> Delete</button>
        </div>
      )}
    </div>
  );
}

function SortMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const sort = (by: string, order: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("sortBy", by); p.set("sortOrder", order);
    router.push(`?${p.toString()}`); setOpen(false);
  };
  
  return (
    <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => setOpen(!open)}>
      Sort <ArrowUpDown className="w-3 h-3" />
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border z-10 text-sm text-gray-700 font-normal overflow-hidden">
          <button onClick={() => sort("title", "desc")} className="block w-full px-4 py-2 text-left hover:bg-gray-50">Title (descending)</button>
          <button onClick={() => sort("title", "asc")} className="block w-full px-4 py-2 text-left hover:bg-gray-50 border-t">Title (ascending)</button>
          <button onClick={() => sort("createdAt", "desc")} className="block w-full px-4 py-2 text-left hover:bg-gray-50 border-t">Newest (descending)</button>
          <button onClick={() => sort("createdAt", "asc")} className="block w-full px-4 py-2 text-left hover:bg-gray-50 border-t">Newest (ascending)</button>
        </div>
      )}
    </div>
  );
}

export function AdminDiplomasTable({ diplomas }: { diplomas: Diploma[] }) {
  return (
    <div className="bg-white rounded-b-md pb-32">
      <div className="grid grid-cols-[140px_1fr_2fr_80px] bg-blue-600 text-white p-4 text-base font-medium">
        <div>Image</div> <div>Title</div> <div>Description</div> <SortMenu />
      </div>
      <div className="divide-y">
        {diplomas.map((d) => (
          <div key={d.id} className="grid grid-cols-[140px_1fr_2fr_80px] items-center p-5 hover:bg-gray-50">
            <div>
              {d.image ? <Image src={d.image} alt={d.title} width={96} height={96} className="rounded-md object-cover w-24 h-24 shadow-sm" /> : <div className="w-24 h-24 bg-gray-200 rounded-md"></div>}
            </div>
            <div className="font-semibold text-base pr-4 text-gray-900">{d.title}</div>
            <div className="text-base text-gray-500 line-clamp-3 pr-4 leading-relaxed">{d.description}</div>
            <ActionMenu id={d.id} />
          </div>
        ))}
        {diplomas.length === 0 && <div className="p-8 text-center text-gray-500">No diplomas found</div>}
      </div>
    </div>
  );
}
