"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import { Exam } from "@/features/student/exams/types/exam.types";
import { Diploma } from "@/features/student/diplomas/types/diploma.types";
import { AdminFormSection } from "../../shared/components/admin-form-section";
import { examSchema, ExamFormValues } from "../lib/schemas/exam.schema";
import { createExamAction, updateExamAction } from "../lib/actions/save-exam.action";
import { ImageUploadDropzone } from "@/shared/ui/image-upload-dropzone";

interface Props {
  initialData?: Exam;
  diplomas: Diploma[];
}

export function AdminExamForm({ initialData, diplomas }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      duration: initialData.duration,
      diplomaId: initialData.diplomaId,
      image: initialData.image || ""
    } : { title: "", description: "", duration: 60, diplomaId: "", image: "" }
  });

  const onSubmit = async (values: ExamFormValues) => {
    setIsSubmitting(true);
    const res = initialData 
      ? await updateExamAction(initialData.id, values)
      : await createExamAction(values);
    
    setIsSubmitting(false);
    if (res.success) {
      toast.success(`Exam ${initialData ? "updated" : "created"} successfully`);
      router.push("/admin/exams");
    } else {
      toast.error(res.error || "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
      <div className="flex justify-between items-center sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10 py-4 border-b border-gray-200 -mx-8 px-8 mb-6">
        <h1 className="text-xl font-bold text-gray-800">{initialData ? "Edit Exam" : "Add New Exam"}</h1>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-sm font-medium text-sm transition-colors"><X className="w-4 h-4 inline mr-2" /> Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-[#00D084] hover:bg-emerald-600 text-white rounded-sm font-medium text-sm transition-colors shadow-sm disabled:opacity-50">
            {isSubmitting ? "Saving..." : <><Save className="w-4 h-4 inline mr-2" /> Save</>}
          </button>
        </div>
      </div>

      <AdminFormSection title="Exam Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase">Title</label>
            <input {...register("title")} className="w-full h-11 px-4 border border-gray-200 rounded-sm text-sm outline-none focus:border-[#2B7FFF]" placeholder="Enter exam title" />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase">Diploma</label>
            <select {...register("diplomaId")} className="w-full h-11 px-4 border border-gray-200 rounded-sm text-sm outline-none focus:border-[#2B7FFF] bg-white">
              <option value="">Select diploma</option>
              {diplomas.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
            {errors.diplomaId && <p className="text-red-500 text-xs">{errors.diplomaId.message}</p>}
          </div>
          
          <div className="md:col-span-1">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageUploadDropzone value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message?.toString()}</p>}
          </div>

          <div className="md:col-span-1 space-y-2 flex flex-col h-full">
            <label className="text-[13px] font-bold text-gray-700 uppercase">Description</label>
            <textarea {...register("description")} className="w-full flex-1 p-4 border border-gray-200 rounded-sm text-sm outline-none focus:border-[#2B7FFF] resize-none min-h-30" placeholder="Enter exam description" />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-1">
            <label className="text-[13px] font-bold text-gray-700 uppercase">Duration (min)</label>
            <input type="number" {...register("duration", { valueAsNumber: true })} className="w-full h-11 px-4 border border-gray-200 rounded-sm text-sm outline-none focus:border-[#2B7FFF]" placeholder="e.g. 60" />
            {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
          </div>
        </div>
      </AdminFormSection>

      {initialData && (
        <AdminFormSection title="Exam Questions">
           <div className="text-sm text-gray-500 italic">Questions management is available after saving or in separate view.</div>
        </AdminFormSection>
      )}
    </form>
  );
}
