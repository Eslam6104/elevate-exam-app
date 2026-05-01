"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { passwordSchema } from "../../register/lib/schemas/register.schema";
import { resetPasswordAction } from "../actions/reset-password.action";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const form = useForm({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values: any) => {
    try {
      await resetPasswordAction({
        token,
        newPassword: values.password,
        confirmPassword: values.confirmPassword
      });
      toast.success("Password reset successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Create a New Password</h1>
        <h2 className="text-blue-600 font-medium">Create a new strong password for your account.</h2>
      </div>
      <div className="space-y-2">
        <Label>Password</Label>
        <Input type="password" {...form.register("password")} />
        {form.formState.errors.password && <p className="text-xs text-red-500">{form.formState.errors.password.message as string}</p>}
      </div>
      <div className="space-y-2">
        <Label>Confirm Password</Label>
        <Input type="password" {...form.register("confirmPassword")} />
        {form.formState.errors.confirmPassword && <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message as string}</p>}
      </div>
      <Button disabled={form.formState.isSubmitting} className="w-full bg-(--primary) text-white h-12">
        Reset Password
      </Button>
    </form>
  );
}
