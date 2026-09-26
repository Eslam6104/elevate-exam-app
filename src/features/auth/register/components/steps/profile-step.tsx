"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema } from "../../lib/schemas/register.schema"
import { useRegister } from "../../context/register-context"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { toast } from "sonner"
import Link from "next/link"

export function ProfileStep() {
  const { data, setData, nextStep } = useRegister();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      username: data.username || "",
      phone: data.phone || "",
    },
  });

  const { errors } = form.formState;

  const onSubmit = (values: any) => {
    setData(values);
    toast.success("Profile saved");
    nextStep();
  };

  const onInvalid = (fieldErrors: any) => {
    const errorKeys = Object.keys(fieldErrors);
    if (errorKeys.length > 0) {
      const firstError = fieldErrors[errorKeys[0]];
      toast.error(firstError?.message || "Please fix the errors in the form before proceeding.");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Create Account</h1>
        <h2 className="text-blue-600 font-medium">Tell us more about you</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-1.5">
          <Label>First Name</Label>
          <Input 
            placeholder="e.g. Eslam"
            {...form.register("firstName")}
            className={errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName.message?.toString()}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <Label>Last Name</Label>
          <Input 
            placeholder="e.g. Ahmed"
            {...form.register("lastName")}
            className={errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName.message?.toString()}</p>
          )}
        </div>
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <Label>Username</Label>
        <Input 
          placeholder="e.g. eslam1234"
          {...form.register("username")}
          className={errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.username ? (
          <p className="text-red-500 text-xs mt-1">{errors.username.message?.toString()}</p>
        ) : (
          <p className="text-gray-400 text-xs mt-0.5">Letters, numbers, and underscores only</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label>Phone Number</Label>
        <Input 
          placeholder="e.g. 01012345678"
          {...form.register("phone")}
          className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.phone ? (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message?.toString()}</p>
        ) : (
          <p className="text-gray-400 text-xs mt-0.5">Must be at least 10 digits</p>
        )}
      </div>

      <Button type="submit" className="w-full h-12 bg-(--primary) text-white font-medium text-base shadow-sm">
        Next →
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-(--primary) font-semibold hover:underline cursor-pointer">
          Login
        </Link>
      </p>
    </form>
  );
}