import { getDiplomasAction } from "@/features/student/diplomas/lib/actions/get-diplomas.action";
import DiplomasGrid from "@/features/student/diplomas/components/diplomas-grid";
import { GraduationCap } from "lucide-react";
import { Diploma } from "@/features/student/diplomas/types/diploma.types";

export const dynamic = "force-dynamic";

export default async function StudentDiplomasPage() {
  let diplomas: Diploma[] = [];
  try {
    const response = await getDiplomasAction(1, 12);
    diplomas = response?.payload?.data || [];
  } catch (error) {
    console.error("Failed to load diplomas on page", error);
  }

  return (
    <div className="w-full mx-auto space-y-8 p-4">
      {/* Header matching the image */}
      <div className="bg-blue-600 text-white p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <GraduationCap className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Diplomas</h1>
      </div>

      {/* Grid */}
      <DiplomasGrid diplomas={diplomas} />
    </div>
  );
}