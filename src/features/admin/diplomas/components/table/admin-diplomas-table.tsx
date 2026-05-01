"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Diploma } from "@/features/student/diplomas/types/diploma.types";
import { AdminSortMenu, SortOption } from "@/features/admin/shared/components/admin-sort-menu";
import { AdminActionMenu, ActionOption } from "@/features/admin/shared/components/admin-action-menu";
import { toast } from "sonner";
import { slugify, encodeId } from "@/shared/lib/utils/slug";

const sortOptions: SortOption[] = [
  { label: "Title", sortBy: "title", sortOrder: "desc", iconType: "text" },
  { label: "Title", sortBy: "title", sortOrder: "asc", iconType: "text" },
  { label: "Newest", sortBy: "createdAt", sortOrder: "desc", iconType: "date" },
  { label: "Newest", sortBy: "createdAt", sortOrder: "asc", iconType: "date" },
];

export function AdminDiplomasTable({ diplomas }: { diplomas: Diploma[] }) {
  const router = useRouter();

  const handleDelete = (id: string) => {
    toast("Are you sure you want to delete this diploma?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const { deleteDiplomaAction } = await import("@/features/admin/diplomas/lib/actions/delete-diploma.action");
          const res = await deleteDiplomaAction(id);
          if (res.success) {
            toast.success("Diploma deleted successfully");
          } else {
            toast.error(res.error || "Failed to delete diploma");
          }
        }
      },
      cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  const getActions = (d: Diploma): ActionOption[] => {
    const slug = `${slugify(d.title)}--${encodeId(d.id)}`;
    return [
      { label: "View Details", icon: Eye, onClick: () => router.push(`/admin/diplomas/${slug}`) },
      { label: "Edit Diploma", icon: Edit, onClick: () => router.push(`/admin/diplomas/${slug}/edit`) },
      { label: "Delete", icon: Trash2, onClick: () => handleDelete(d.id), isDestructive: true },
    ];
  };

  // Define grid columns: Image, Title, Description, Sort
  const gridTemplate = "grid-cols-[140px_200px_1fr_80px]";

  return (
    <div className="w-full bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm mb-20">
      {/* Table Header */}
      <div className={`grid ${gridTemplate} bg-[#2B7FFF] text-white py-3 px-6 text-[14px] font-bold uppercase tracking-wider items-center`}>
        <div>Image</div>
        <div>Title</div>
        <div>Description</div>
        <div className="flex justify-end">
          <AdminSortMenu options={sortOptions} />
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {diplomas.map((d) => (
          <div key={d.id} className={`grid ${gridTemplate} py-5 px-6 items-center hover:bg-gray-50 transition-colors group`}>
            {/* Image */}
            <div className="pr-4">
              <div className="relative w-24 h-24 rounded-md border border-gray-100 overflow-hidden bg-gray-50 shadow-sm">
                {d.image ? (
                  <Image 
                    src={d.image} 
                    alt={d.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                    <Eye className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="font-bold text-[16px] text-gray-900 pr-4">
              {d.title}
            </div>

            {/* Description */}
            <div className="text-[14px] text-gray-500 line-clamp-3 leading-relaxed pr-8">
              {d.description}
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <AdminActionMenu actions={getActions(d)} />
            </div>
          </div>
        ))}

        {diplomas.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic bg-gray-50/30">
            No diplomas found.
          </div>
        )}
      </div>
    </div>
  );
}
