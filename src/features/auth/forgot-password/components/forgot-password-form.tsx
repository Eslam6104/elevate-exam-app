"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { forgotPasswordSchema, ForgotPasswordSchema } from "../schemas/forgot-password.schema";
import { forgotPasswordAction } from "../actions/forgot-password.action";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { EmailSentSuccess } from "@/features/auth/components/email-sent-success";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ForgotPasswordSchema>({ resolver: zodResolver(forgotPasswordSchema) });
  
  const onSubmit = async (values: ForgotPasswordSchema) => {
    try {
      const redirectUrl = window.location.origin + "/reset-password";
      await forgotPasswordAction({ email: values.email, redirectUrl });
      setSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    }
  };

  if (submitted) {
    return (
      <EmailSentSuccess 
        title="Password Reset Sent"
        email={form.getValues("email")}
        actionText="password reset link"
        instructions="Please check your inbox and follow the instructions to reset your password."
        backHref="/login"
        footer={
          <p className="text-center text-sm text-(--text-secondary)">
            Don't have an account? <Link href="/register" className="text-(--primary) hover:underline">Create yours</Link>
          </p>
        }
      />
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2">
        <h2 className="text-[30px] font-bold text-(--text-primary)">Forgot Password</h2>
        <p className="text-sm text-(--text-secondary)">Don't worry, we will help you recover your account.</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="user@example.com" {...form.register("email")} />
          {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full h-12 bg-(--primary) text-white flex gap-2">
          {form.formState.isSubmitting ? "Sending..." : <>Next <ArrowRight className="w-4 h-4" /></>}
        </Button>
        <p className="text-center text-sm text-(--text-secondary)">
          Don't have an account? <Link href="/register" className="text-(--primary) hover:underline">Create yours</Link>
        </p>
      </form>
    </div>
  );
}
