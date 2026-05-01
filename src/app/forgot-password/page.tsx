import AuthLayout from "@/features/auth/layout/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/forgot-password/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
