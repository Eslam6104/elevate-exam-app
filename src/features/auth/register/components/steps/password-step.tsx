"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { passwordSchema } from "../../lib/schemas/register.schema"
import { registerAction } from "../../lib/actions/register.action"
import { useRegister } from "../../context/register-context"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { toast } from "sonner"

export function PasswordStep() {

  const { data } = useRegister()

  const form = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (values: any) => {

    try {

      await registerAction({
        ...data,
        ...values,
      })

      toast.success("Account created successfully")

    } catch (error: any) {

      toast.error(error.message)

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
          Create a strong password
        </h2>

      </div>

      <div className="space-y-2">

        <Label>Password</Label>

        <Input
          type="password"
          {...form.register("password")}
        />

      </div>

      <div className="space-y-2">

        <Label>Confirm Password</Label>

        <Input
          type="password"
          {...form.register("confirmPassword")}
        />

      </div>

      <Button
        className="w-full"
      >
        Create Account
      </Button>

    </form>
  )
}