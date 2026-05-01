"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminFormHeader } from "@/features/admin/shared/components/admin-form-header";
import { AdminFormSection } from "@/features/admin/shared/components/admin-form-section";
import { ImageUploadDropzone } from "@/shared/ui/image-upload-dropzone";
import { createDiplomaSchema, CreateDiplomaValues } from "@/features/admin/diplomas/schemas/create-diploma.schema";
import { createDiplomaAction } from "@/features/admin/diplomas/lib/actions/create-diploma.action";
import { toast } from "sonner";

export default function AddNewDiplomaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateDiplomaValues>({
    resolver: zodResolver(createDiplomaSchema),
    defaultValues: { title: "", description: "", image: "" }
  });

  const onSubmit = async (data: CreateDiplomaValues) => {
    setIsSubmitting(true);
    const result = await createDiplomaAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Diploma created successfully!");
      router.push("/admin/diplomas");
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      <AdminFormHeader 
        breadcrumbs={[
          { label: "Diplomas", href: "/admin/diplomas" },
          { label: "Add New Diploma" }
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
