import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function AdminFormSection({ title, children }: Props) {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200">
      <div className="bg-[#2B7FFF] px-6 py-3">
        <h2 className="text-white font-semibold text-[15px]">{title}</h2>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );
}
