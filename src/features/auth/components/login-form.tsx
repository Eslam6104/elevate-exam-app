"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginSchema } from "../lib/schemas/login.schema";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function LoginForm() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setError(null);
    
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      const session = await getSession();
      const userRole = session?.user?.role;
      
      router.refresh();
      
      if (userRole === "ADMIN") {
        router.push("/admin/diplomas");
      } else {
        router.push("/student/diplomas");
      }
    }
  };

  return (

    <div className="w-full max-w-140 space-y-8">

      {/* title */}
   <h2 className="text-[30px] font-bold text-(--text-primary)">
  Login
</h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* username */}
        <div className="space-y-2">

          <Label>Username</Label>

          <Input {...form.register("username")} />

          {form.formState.errors.username && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.username.message}
            </p>
          )}

        </div>

        {/* password */}
        <div className="space-y-2">

        <Label className="text-(--text-primary) text-[16px] font-medium">
  Password
</Label>

        <Input
  className="focus-visible:ring-(--primary)"
  {...form.register("password")}
/>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-(--text-primary) cursor-pointer hover:underline">
              Forgot your password?
            </Link>
          </div>


        </div>

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* button */}
        <Button
          disabled={loading}
          type="submit"
          className="w-full h-12 bg-(--primary) text-white hover:opacity-90"
        >
          {loading ? "Loading..." : "Login"}
        </Button>

        {/* register */}
        <p className="text-center text-[18px] text-(--text-secondary)">

          Don’t have an account?

          <Link href="/register" className="text-(--primary) ml-1 cursor-pointer">
            Create yours
          </Link>

        </p>

      </form>

    </div>
  );
}