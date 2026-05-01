import { ProfileForm } from "@/features/shared/account/components/profile-form";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <div className="w-full">
      <ProfileForm />
    </div>
  );
}
