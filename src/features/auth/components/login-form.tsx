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
import { Shield, GraduationCap, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const executeLogin = async (u: string, p: string, roleName?: string) => {
    setLoading(true);
    setLoadingRole(roleName || null);
    setError(null);

    try {
      const result = await signIn("credentials", {
        username: u,
        password: p,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        setLoadingRole(null);
        return;
      }

      // Determine redirect target
      let targetUrl = "/student/diplomas";
      try {
        const session = await getSession();
        if (session?.user?.role?.toLowerCase() === "admin" || u.toLowerCase() === "admin") {
          targetUrl = "/admin/diplomas";
        }
      } catch {
        if (u.toLowerCase() === "admin") {
          targetUrl = "/admin/diplomas";
        }
      }

      // Navigate to destination
      window.location.href = targetUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log in");
      setLoading(false);
      setLoadingRole(null);
    }
  };

  const onSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }
    await executeLogin(username.trim(), password, username.toLowerCase() === "admin" ? "admin" : "student");
  };

  const handleTestLogin = (u: string, p: string, roleName: string) => {
    // 1. Immediately reflect values into input fields on screen
    setUsername(u);
    setPassword(p);
    form.setValue("username", u, { shouldValidate: true });
    form.setValue("password", p, { shouldValidate: true });

    // 2. Automatically log in with the selected test account
    executeLogin(u, p, roleName);
  };

  return (
    <div className="w-full max-w-140 space-y-8">
      {/* Title */}
      <h2 className="text-[30px] font-bold text-(--text-primary)">
        Login
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-6"
      >
        {/* Username */}
        <div className="space-y-2">
          <Label>Username or Email</Label>
          <Input
            id="username-input"
            value={username}
            placeholder="Enter username (e.g. student or admin)"
            onChange={(e) => {
              setUsername(e.target.value);
              form.setValue("username", e.target.value, { shouldValidate: true });
            }}
          />
          {form.formState.errors.username && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label className="text-(--text-primary) text-[16px] font-medium">
            Password
          </Label>
          <Input
            id="password-input"
            type="password"
            value={password}
            placeholder="Enter your password"
            className="focus-visible:ring-(--primary)"
            onChange={(e) => {
              setPassword(e.target.value);
              form.setValue("password", e.target.value, { shouldValidate: true });
            }}
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-(--text-primary) cursor-pointer hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          disabled={loading}
          type="submit"
          className="w-full h-12 bg-(--primary) text-white hover:opacity-90 flex items-center justify-center gap-2 text-base font-semibold"
        >
          {loading && !loadingRole && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading && !loadingRole ? "Logging in..." : "Login"}
        </Button>

        {/* Register link */}
        <p className="text-center text-[18px] text-(--text-secondary)">
          Don&apos;t have an account?
          <Link href="/register" className="text-(--primary) ml-1 cursor-pointer font-medium hover:underline">
            Create yours
          </Link>
        </p>
      </form>

      {/* ── Quick Demo Login ── */}
      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">Quick Demo Login</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleTestLogin("student", "Student@123", "student")}
          className="group relative flex items-center justify-center gap-2.5 rounded-xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white px-4 py-3.5 text-sm font-semibold text-blue-700 transition-all duration-200 hover:border-blue-400 hover:from-blue-100 hover:to-blue-50 hover:shadow-md hover:shadow-blue-100/50 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading && loadingRole === "student" ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          ) : (
            <GraduationCap className="w-5 h-5 text-blue-600 transition-transform group-hover:scale-110" />
          )}
          <span>{loading && loadingRole === "student" ? "Entering..." : "Student"}</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleTestLogin("admin", "Admin@123", "admin")}
          className="group relative flex items-center justify-center gap-2.5 rounded-xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white px-4 py-3.5 text-sm font-semibold text-amber-700 transition-all duration-200 hover:border-amber-400 hover:from-amber-100 hover:to-amber-50 hover:shadow-md hover:shadow-amber-100/50 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading && loadingRole === "admin" ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
          ) : (
            <Shield className="w-5 h-5 text-amber-600 transition-transform group-hover:scale-110" />
          )}
          <span>{loading && loadingRole === "admin" ? "Entering..." : "Admin"}</span>
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Click a button above to auto-fill credentials and enter the dashboard instantly
      </p>
    </div>
  );
}