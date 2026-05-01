import { ChangePasswordForm } from "@/features/shared/account/components/change-password-form";

export default function PasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Ensure your account is secure by using a strong password.</p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
