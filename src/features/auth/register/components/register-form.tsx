"use client";

import { RegisterProvider } from "../context/register-context";
import { RegisterStepper } from "./register-stepper";
import { EmailStep } from "./steps/email-step";
import { OtpStep } from "./steps/otp-step";
import { ProfileStep } from "./steps/profile-step";
import { PasswordStep } from "./steps/password-step";
import { useRegister } from "../context/register-context";

function Steps() {
  const { step } = useRegister();

  const steps = [
    <EmailStep key="email" />,
    <OtpStep key="otp" />,
    <ProfileStep key="profile" />,
    <PasswordStep key="password" />,
  ];

  return <>{steps[step]}</>;
}

export default function RegisterForm() {
  return (
    <RegisterProvider>
      <div className="w-150 space-y-8 justify-center items-center">

        <RegisterStepper />

        <div className="space-y-6">
          <Steps />
        </div>

      </div>
    </RegisterProvider>
  );
}