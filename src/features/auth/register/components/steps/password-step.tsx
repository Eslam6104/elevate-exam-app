import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, ShieldCheck } from "lucide-react";
import { passwordSchema } from "../../lib/schemas/register.schema";
import { registerAction } from "../../lib/actions/register.action";
import { useRegister } from "../../context/register-context";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { toast } from "sonner";

export function PasswordStep() {
  const router = useRouter();
  const { data } = useRegister();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { errors } = form.formState;
  const currentPassword = form.watch("password") || "";

  // Password rules checklist
  const rules = [
    { label: "At least 8 characters", satisfied: currentPassword.length >= 8 },
    { label: "At least one uppercase letter (A-Z)", satisfied: /[A-Z]/.test(currentPassword) },
    { label: "At least one number (0-9)", satisfied: /[0-9]/.test(currentPassword) },
    { label: "At least one special character (!@#$%^&*)", satisfied: /[^A-Za-z0-9]/.test(currentPassword) },
  ];

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await registerAction({
        ...data,
        ...values,
      });

      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (fieldErrors: any) => {
    const errorKeys = Object.keys(fieldErrors);
    if (errorKeys.length > 0) {
      const firstError = fieldErrors[errorKeys[0]];
      toast.error(firstError?.message || "Please fix password requirements before submitting.");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Create Account</h1>
        <h2 className="text-blue-600 font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-5 h-5 inline text-blue-600" />
          Create a strong password
        </h2>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="e.g. Eslam123$"
          {...form.register("password")}
          className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message?.toString()}</p>
        )}

        {/* Live password requirements indicators */}
        <div className="bg-gray-50 border border-gray-100 rounded-md p-3 space-y-1.5 mt-2">
          <p className="text-xs font-semibold text-gray-600 mb-1">Password Requirements:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
            {rules.map((rule, idx) => (
              <div key={idx} className={`flex items-center gap-1.5 ${rule.satisfied ? "text-emerald-600 font-medium" : "text-gray-400"}`}>
                {rule.satisfied ? <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <X className="w-3.5 h-3.5 shrink-0 text-gray-300" />}
                <span>{rule.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label>Confirm Password</Label>
        <Input
          type="password"
          placeholder="Re-enter your password"
          {...form.register("confirmPassword")}
          className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message?.toString()}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-(--primary) hover:bg-blue-700 text-white h-12 font-medium text-base shadow-sm transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
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