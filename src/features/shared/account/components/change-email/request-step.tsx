"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useRequestEmailChangeMutation } from "../../api/email";
import { useSession } from "next-auth/react";

const schema = z.object({ email: z.string().email("Please enter a valid email") });

interface Props {
  onSuccess: (email: string) => void;
}

export function RequestStep({ onSuccess }: Props) {
  const { data: session } = useSession();
  const { mutateAsync, isPending } = useRequestEmailChangeMutation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: { email: string }) => {
    if (values.email === session?.user?.email) {
      toast.error("Please enter a different email address.");
      return;
    }
    try {
      await mutateAsync({ newEmail: values.email });
      toast.success("Verification code sent to your new email.");
      onSuccess(values.email);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to request email change");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white">
      <div className="space-y-2">
        <h3 className="text-blue-600 font-medium">Enter your new email</h3>
        <div className="pt-2">
          <Label htmlFor="new-email" className="sr-only">Email</Label>
          <Input id="new-email" placeholder="user@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <Button type="submit" className="w-full bg-blue-600 text-white py-6" disabled={isPending}>
        {isPending ? "Sending..." : "Next"}
      </Button>
    </form>
  );
}
