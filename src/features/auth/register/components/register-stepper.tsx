"use client";

import { useRegister } from "../context/register-context";

const steps = [1, 2, 3, 4];

export function RegisterStepper() {
  const { step } = useRegister();

  return (
    <div className="flex items-center justify-between mb-6">

      {steps.map((s, i) => (
        <div key={s} className="flex items-center w-full">

          <div
            className={`
            w-3 h-3 rotate-45
            ${i <= step ? "bg-blue-600" : "bg-gray-300"}
            `}
          />

          {i !== steps.length - 1 && (
            <div
              className={`
              flex-1 h-0.5
              ${i < step ? "bg-blue-600" : "border-dashed border-t"}
              `}
            />
          )}
        </div>
      ))}

    </div>
  );
}