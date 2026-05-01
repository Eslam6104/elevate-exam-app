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
  const form = useForm({ resolver: zodResolver(emailSchema) });

  const onSubmit = async (values: any) => {
    try {
      await sendOtpAction(values.email);
      setData(values);
      setSubmitted(true);
      toast.success("OTP sent successfully");
    } catch (error: any) {
      toast.error(error.message);
      form.setError("email", { message: error.message });
    }
  };

  if (submitted) {
    return (
      <EmailSentSuccess
        title="Verification Email Sent"
        email={form.getValues("email") as string}
        actionText="verification code"
        instructions="Please check your inbox to get your OTP."
        footer={<Button onClick={nextStep} className="w-full mt-4 bg-(--primary) text-white">Enter OTP</Button>}
      />
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