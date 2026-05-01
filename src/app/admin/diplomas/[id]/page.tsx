"use client";
import { getDiplomaByIdAction } from "@/features/student/diplomas/lib/actions/get-diploma-by-id.action";
import { AdminViewHeader } from "@/features/admin/shared/components/admin-view-header";
import { AdminDiplomaDetails } from "@/features/admin/diplomas/components/admin-diploma-details";
import { Ban, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { Diploma } from "@/features/student/diplomas/types/diploma.types";
import { toast } from "sonner";

import { extractIdFromSlug } from "@/shared/lib/utils/slug";

export default function AdminDiplomaViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: rawId } = use(params);
  const id = extractIdFromSlug(rawId);
  const [diploma, setDiploma] = useState<Diploma | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDiplomaByIdAction(id).then(res => {
      if (res?.payload?.diploma) {
        setDiploma(res.payload.diploma);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!diploma) {
    return notFound();
  }

  const handleDelete = () => {
    toast("Are you sure you want to delete this diploma?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const { deleteDiplomaAction } = await import("@/features/admin/diplomas/lib/actions/delete-diploma.action");
          const res = await deleteDiplomaAction(id);
          if (res.success) {
            toast.success("Diploma deleted successfully");
            router.push("/admin/diplomas");
          } else {
            toast.error(res.error || "Failed to delete diploma");
          }
        }
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  };

  return (
    <div className="pb-20">
      <AdminViewHeader 
        breadcrumbs={[
          { label: "Diplomas", href: "/admin/diplomas" },
          { label: diploma.title }
        ]}
        title={diploma.title}
        actions={
          <>
            {diploma.immutable && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-sm font-medium text-sm">
                <Ban className="w-4 h-4" /> Immutable
              </div>
            )}
            <Link href={`/admin/diplomas/${id}/edit`} className="flex items-center gap-2 px-5 py-2.5 bg-[#2B7FFF] hover:bg-blue-600 transition-colors text-white rounded-sm font-medium text-sm shadow-sm">
              <Edit className="w-4 h-4" /> Edit
            </Link>
            <button onClick={handleDelete} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 transition-colors text-white rounded-sm font-medium text-sm shadow-sm">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </>
        }
      />
      <AdminDiplomaDetails diploma={diploma} />
    </div>
  );
}
