"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { profileSchema, ProfileFormValues } from "../schemas/profile";
import { useProfileQuery, useUpdateProfileMutation } from "../api/profile";
import { ProfileFormFields } from "./profile-form-fields";
import { ProfileFormActions } from "./profile-form-actions";

export function ProfileForm() {
  const { data: session, update, status } = useSession();
  const { data, isLoading: isFetching } = useProfileQuery();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation();

  const user = data?.user || session?.user;

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: (user as any)?.username || (user as any)?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    // Only reset if we received new data from the server or if it's the initial load from session
    if (data?.user || session?.user) {
      const u = data?.user || session?.user;
      methods.reset({
        firstName: u?.firstName || "",
        lastName: u?.lastName || "",
        username: (u as any)?.username || (u as any)?.name || "",
        email: u?.email || "",
        phone: u?.phone || "",
      });
    }
  }, [data?.user, session?.user, methods]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        profilePhoto: data?.user?.profilePhoto || "",
      });
      await update({ user: values });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (!data?.user && status === "loading") {
    return <div className="text-gray-500 py-4 flex items-center justify-center min-h-[400px]">Loading profile data...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-2xl">
        <ProfileFormFields />
        <ProfileFormActions isLoading={isPending} />
      </form>
    </FormProvider>
  );
}
