"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { OtpInput } from "@/shared/ui/otp-input";
import { useConfirmEmailChangeMutation, useRequestEmailChangeMutation } from "../../api/email";
import { useSession } from "next-auth/react";

interface Props {
  email: string;
  onEdit: () => void;
  onSuccess: () => void;
}

export function VerifyStep({ email, onEdit, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { update } = useSession();
  
  const { mutateAsync: confirm, isPending: isConfirming } = useConfirmEmailChangeMutation();
  const { mutateAsync: request } = useRequestEmailChangeMutation();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const onResend = async () => {
    if (countdown > 0) return;
    try {
      await request({ newEmail: email });
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown((p) => {
          if (p <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return p - 1;
        });
      }, 1000);
      toast.success("Verification code resent.");
    } catch {
      toast.error("Failed to resend code");
    }
  };

  const onVerify = async () => {
    if (code.length !== 6) return toast.error("Enter a valid code.");
    try {
      await confirm({ code });
      await update({ user: { email } });
      toast.success("Email changed successfully!");
      onSuccess();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Invalid code");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-blue-600 font-medium text-lg">Verify OTP</h3>
        <p className="text-sm text-muted-foreground">
          Please enter the 6-digits code we have sent to:{" "}
          <span className="text-gray-900 font-medium">{email}</span>.{" "}
          <button onClick={onEdit} className="text-blue-600 font-medium underline">Edit</button>
        </p>
      </div>
      <div className="space-y-4">
        <OtpInput value={code} onChange={setCode} disabled={isConfirming} />
        <p className="text-center text-sm text-muted-foreground">
          You can request another code in:{" "}
          <button disabled={countdown > 0} onClick={onResend} className={countdown > 0 ? "text-gray-400" : "text-blue-600 underline"}>
            {countdown > 0 ? `${countdown}s` : "Resend"}
          </button>
        </p>
      </div>
      <Button onClick={onVerify} className="w-full bg-blue-600 text-white py-6" disabled={isConfirming || code.length !== 6}>
        {isConfirming ? "Verifying..." : "Verify Code"}
      </Button>
    </div>
  );
}
