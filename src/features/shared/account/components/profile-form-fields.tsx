"use client";

import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "../schemas/profile";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useState } from "react";
import { ChangeEmailModal } from "./change-email";

export function ProfileFormFields() {
  const { register, formState: { errors } } = useFormContext<ProfileFormValues>();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="firstName">First name</Label>
        <Input id="firstName" {...register("firstName")} />
        {errors.firstName && (
          <p className="text-sm text-red-500">{errors.firstName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last name</Label>
        <Input id="lastName" {...register("lastName")} />
        {errors.lastName && (
          <p className="text-sm text-red-500">{errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username")} disabled className="bg-gray-50" />
      </div>

      <div className="space-y-2 md:col-span-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="email">Email</Label>
          <button 
            type="button" 
            onClick={() => setIsEmailModalOpen(true)}
            className="text-sm text-blue-600 font-medium"
          >
            Change
          </button>
        </div>
        <Input id="email" {...register("email")} disabled className="bg-gray-50" />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...register("phone")} />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <ChangeEmailModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
      />
    </div>
  );
}
