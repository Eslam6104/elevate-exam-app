"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { changePasswordSchema, ChangePasswordSchema } from "../schemas/password";
import { useChangePasswordMutation } from "../api/password";
import { Button } from "@/shared/ui/button";
import { PasswordField } from "./password-field";


export function ChangePasswordForm() {
  const { mutateAsync, isPending } = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: ChangePasswordSchema) => {
    try {
      await mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      toast.success("Password changed successfully");
      reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <PasswordField
        id="currentPassword"
        label="Current Password"
        registration={register("currentPassword")}
        error={errors.currentPassword?.message}
      />

      <PasswordField
        id="newPassword"
        label="New Password"
        registration={register("newPassword")}
        error={errors.newPassword?.message}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm New Password"
        registration={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6"
      >
        {isPending ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
