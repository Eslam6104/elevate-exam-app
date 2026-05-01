import { Diploma } from "../types/diploma.types";
import DiplomaCard from "./diploma-card";

interface DiplomasGridProps {
  diplomas: Diploma[];
}

export default function DiplomasGrid({ diplomas }: DiplomasGridProps) {
  if (!diplomas || diplomas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-500 text-lg">No diplomas available right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {diplomas.map((diploma) => (
        <DiplomaCard key={diploma.id} diploma={diploma} />
      ))}
    </div>
  );
}
