import { Code } from "lucide-react";

export default function HeroHeader() {
  return (
    <div className="space-y-10">

      {/* logo */}
      <div className="flex items-center gap-2 text-(--primary) font-semibold">

        <Code size={22} />

        <span>Exam App</span>

      </div>

      {/* title */}
      <h1 className="text-4xl font-bold text-(--text-primary) leading-tight">
        Empower your learning journey
        with our smart exam platform.
      </h1>

    </div>
  );
}