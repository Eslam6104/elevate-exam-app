"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { emailSchema } from "../../lib/schemas/register.schema";
import { sendOtpAction } from "../../lib/actions/send-otp.action";
import { useRegister } from "../../context/register-context";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { EmailSentSuccess } from "@/features/auth/components/email-sent-success";

export function EmailStep() {
  const { setData, nextStep } = useRegister();
  const [submitted, setSubmitted] = useState(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const form = useForm({ resolver: zodResolver(emailSchema) });

  const onSubmit = async (values: any) => {
    try {
      const res = await sendOtpAction(values.email);
      const code = res?.payload?.code || res?.code;
      if (code) {
        setOtpCode(code);
        setData({ ...values, otp: code });
        toast.success(`Verification code: ${code}`, { duration: 8000 });
      } else {
        setData(values);
        toast.success("OTP sent successfully");
      }
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message);
      form.setError("email", { message: error.message });
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <EmailSentSuccess
          title="Verification Email Sent"
          email={form.getValues("email") as string}
          actionText="verification code"
          instructions="Your 6-digit OTP verification code is ready below:"
          footer={
            <div className="space-y-4">
              {otpCode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-xs uppercase text-blue-600 font-bold tracking-wider">Your Verification Code (OTP)</p>
                  <p className="text-3xl font-mono font-extrabold text-blue-700 tracking-widest my-2 select-all">{otpCode}</p>
                  <p className="text-xs text-blue-500">Use this code to verify your account</p>
                </div>
              )}
              <Button onClick={nextStep} className="w-full bg-(--primary) text-white h-12 text-base">
                Enter OTP →
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div><h1 className="text-3xl font-semibold">Create Account</h1></div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input placeholder="user@example.com" {...form.register("email")} />
        {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email?.message as string}</p>}
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-(--primary) text-white h-12">Next →</Button>
      <p className="text-sm text-muted-foreground text-center">
        Already have an account? <span className="text-(--primary)">Login</span>
      </p>
    </form>
  );
}