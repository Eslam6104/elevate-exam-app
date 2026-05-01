import AuthLayout from "@/features/auth/layout/auth-layout";
import { ResetPasswordForm } from "@/features/auth/reset-password/components/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  if (!resolvedSearchParams.token) {
    return (
      <AuthLayout>
        <div className="text-center p-8 bg-red-50 text-red-600 rounded-md">
          Invalid or missing reset token.
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <ResetPasswordForm token={resolvedSearchParams.token} />
    </AuthLayout>
  );
}
