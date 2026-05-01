"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type RegisterData = {
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

type RegisterContextType = {
  data: RegisterData
  setData: (values: Partial<RegisterData>) => void
  step: number
  nextStep: () => void
  prevStep: () => void
}

const RegisterContext = createContext<RegisterContextType | null>(null)

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [data, setRegisterData] = useState<RegisterData>({})
  const [step, setStep] = useState(0)

  const setData = (values: Partial<RegisterData>) =>
    setRegisterData((prev) => ({ ...prev, ...values }))

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  return (
    <RegisterContext.Provider value={{ data, setData, step, nextStep, prevStep }}>
      {children}
    </RegisterContext.Provider>
  )
}

export function useRegister() {
  const ctx = useContext(RegisterContext)
  if (!ctx) throw new Error("useRegister must be used inside RegisterProvider")
  return ctx
}