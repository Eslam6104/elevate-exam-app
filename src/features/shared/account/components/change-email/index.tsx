"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { RequestStep } from "./request-step";
import { VerifyStep } from "./verify-step";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangeEmailModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [newEmail, setNewEmail] = useState("");

  const handleClose = () => {
    setStep(1);
    setNewEmail("");
    onClose();
  };

  const handleRequestSuccess = (email: string) => {
    setNewEmail(email);
    setStep(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-106.25 p-0 overflow-hidden bg-white border">
        <DialogHeader className="p-6 pb-2 border-b bg-white">
          <DialogTitle className="text-xl font-bold">Change Email</DialogTitle>
        </DialogHeader>

        <div className="p-6 bg-white">
          {step === 1 ? (
            <RequestStep onSuccess={handleRequestSuccess} />
          ) : (
            <VerifyStep
              email={newEmail}
              onEdit={() => setStep(1)}
              onSuccess={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
