"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminFormHeader } from "@/features/admin/shared/components/admin-form-header";
import { AdminFormSection } from "@/features/admin/shared/components/admin-form-section";
import { ImageUploadDropzone } from "@/shared/ui/image-upload-dropzone";
import { createDiplomaSchema, CreateDiplomaValues } from "@/features/admin/diplomas/schemas/create-diploma.schema";
import { updateDiplomaAction } from "@/features/admin/diplomas/lib/actions/update-diploma.action";
import { getDiplomaByIdAction } from "@/features/student/diplomas/lib/actions/get-diploma-by-id.action";
import { toast } from "sonner";
import { extractIdFromSlug } from "@/shared/lib/utils/slug";

export default function EditDiplomaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: rawId } = use(params);
  const id = extractIdFromSlug(rawId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CreateDiplomaValues>({
    resolver: zodResolver(createDiplomaSchema),
    defaultValues: { title: "", description: "", image: "" }
  });

  useEffect(() => {
    getDiplomaByIdAction(id).then(res => {
      if (res?.payload?.diploma) {
        reset({
          title: res.payload.diploma.title,
          description: res.payload.diploma.description,
          image: res.payload.diploma.image || "",
        });
      }
      setIsLoading(false);
    }).catch(() => {
      toast.error("Failed to load diploma details");
      setIsLoading(false);
    });
  }, [id, reset]);

  const onSubmit = async (data: CreateDiplomaValues) => {
    setIsSubmitting(true);
    const result = await updateDiplomaAction(id, data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Diploma updated successfully!");
      router.push("/admin/diplomas");
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      <AdminFormHeader 
        breadcrumbs={[
          { label: "Diplomas", href: "/admin/diplomas" },
          { label: "Edit Diploma" }
        ]}
        onCancelHref="/admin/diplomas"
        isSubmitting={isSubmitting}
      />

      <AdminFormSection title="Diploma Information">
        <div className="space-y-6">
          <div>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageUploadDropzone value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[15px] font-medium text-gray-700">Title</label>
            <input 
              type="text"
              {...register("title")}
              className="w-full h-11 px-4 border border-gray-200 rounded-sm outline-none focus:border-[#2B7FFF] transition-colors"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[15px] font-medium text-gray-700">Description</label>
            <textarea 
              {...register("description")}
              rows={5}
              className="w-full p-4 border border-gray-200 rounded-sm outline-none focus:border-[#2B7FFF] transition-colors resize-y"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
        </div>
      </AdminFormSection>
    </form>
  );
}
