import { ProfileForm } from "@/features/shared/account/components/profile-form";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-500 mt-1">Update your personal details and how others see you on the platform.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
