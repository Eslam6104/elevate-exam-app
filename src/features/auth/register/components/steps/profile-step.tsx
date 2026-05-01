"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema } from "../../lib/schemas/register.schema"
import { useRegister } from "../../context/register-context"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { toast } from "sonner"

export function ProfileStep() {

  const { setData, nextStep } = useRegister()

  const form = useForm({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = (values: any) => {

    setData(values)

    toast.success("Profile saved")

    nextStep()

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
          Tell us more about you
        </h2>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="space-y-2">

          <Label>First Name</Label>

          <Input {...form.register("firstName")} />

        </div>

        <div className="space-y-2">

          <Label>Last Name</Label>

          <Input {...form.register("lastName")} />

        </div>

      </div>

      <div className="space-y-2">

        <Label>Username</Label>

        <Input {...form.register("username")} />

      </div>

      <div className="space-y-2">

        <Label>Phone</Label>

        <Input {...form.register("phone")} />

      </div>

      <Button className="w-full">
        Next →
      </Button>

    </form>
  )
}