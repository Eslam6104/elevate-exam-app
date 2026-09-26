"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { otpSchema } from "../../lib/schemas/register.schema"
import { verifyOtpAction } from "../../lib/actions/verify-otp.action"
import { useRegister } from "../../context/register-context"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { toast } from "sonner"
import Link from "next/link"

export function OtpStep() {

  const { data, nextStep } = useRegister()

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: data.otp || "",
    },
  })

  const onSubmit = async (values: any) => {
    try {

      await verifyOtpAction(data.email!, values.code)

      toast.success("Email verified")

      nextStep()

    } catch (error: any) {

      toast.error(error.message)

      form.setError("code", {
        message: error.message,
      })
    }
  }

  const { errors } = form.formState;

  const onInvalid = (fieldErrors: any) => {
    const errorKeys = Object.keys(fieldErrors);
    if (errorKeys.length > 0) {
      toast.error(fieldErrors[errorKeys[0]]?.message || "Please enter the 6-digit verification code");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="space-y-8"
    >

      <div className="space-y-2">

        <h1 className="text-3xl font-semibold">
          Create Account
        </h1>

        <h2 className="text-blue-600 font-medium">
          Verify OTP
        </h2>

        <p className="text-sm text-muted-foreground">
          Please enter the 6-digits code we have sent to:
          <span className="font-medium"> {data.email}</span>
        </p>

        {data.otp && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between text-sm mt-3">
            <span className="text-blue-700 text-xs">
              Your Code: <strong className="font-mono font-bold text-sm tracking-wider">{data.otp}</strong>
            </span>
            <button
              type="button"
              onClick={() => form.setValue("code", data.otp!)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded font-medium transition-colors"
            >
              Fill Code
            </button>
          </div>
        )}

      </div>

      <div className="space-y-2">

        <Label>Verification Code</Label>

        <Input
          placeholder="123456"
          maxLength={6}
          {...form.register("code")}
          className={errors.code ? "border-red-500 focus-visible:ring-red-500 tracking-widest text-center text-lg font-mono" : "tracking-widest text-center text-lg font-mono"}
        />
        {errors.code && (
          <p className="text-red-500 text-xs mt-1">{errors.code.message?.toString()}</p>
        )}

      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-(--primary) text-white font-medium text-base shadow-sm"
      >
        Verify Code
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-(--primary) font-semibold hover:underline cursor-pointer">
          Login
        </Link>
      </p>

    </form>
  )
}