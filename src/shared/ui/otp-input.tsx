import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { Input } from "./input";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ length = 6, value, onChange, disabled }: OtpInputProps) {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^[0-9]*$/.test(val)) return;

    const newValue = value.split("");
    // Just take the last character typed
    newValue[index] = val.slice(-1);
    const combinedValue = newValue.join("");
    onChange(combinedValue);

    // Move to next input if there's a value and it's not the last input
    if (val && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValue = value.split("");
      
      // If there is a value in the current input, clear it
      if (newValue[index]) {
        newValue[index] = "";
        onChange(newValue.join(""));
      } 
      // If empty, clear previous input and focus it
      else if (index > 0) {
        newValue[index - 1] = "";
        onChange(newValue.join(""));
        setActiveInput(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOnPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length).trim();
    if (!/^[0-9]*$/.test(pastedData)) return;

    onChange(pastedData);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    setActiveInput(nextIndex);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }, (_, i) => {
        const char = value[i] || "";
        return (
          <Input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            value={char}
            onChange={(e) => handleOnChange(e, i)}
            onKeyDown={(e) => handleOnKeyDown(e, i)}
            onPaste={handleOnPaste}
            onFocus={() => setActiveInput(i)}
            disabled={disabled}
            className="w-12 h-12 text-center text-lg font-medium shadow-sm transition-all focus:scale-105"
            maxLength={2}
          />
        );
      })}
    </div>
  );
}
