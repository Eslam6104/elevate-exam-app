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

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
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
          {...form.register("code")}
        />

      </div>

      <Button
        type="submit"
        className="w-full"
      >
        Verify Code
      </Button>

    </form>
  )
}