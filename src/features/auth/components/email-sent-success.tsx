import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";

export interface EmailSentProps {
  title: string;
  email: string;
  actionText: string;
  instructions: string;
  onBack?: () => void;
  backHref?: string;
  footer?: React.ReactNode;
}

export function EmailSentSuccess({
  title, email, actionText, instructions, onBack, backHref, footer
}: EmailSentProps) {
  return (
    <div className="w-full max-w-md space-y-8">
      {onBack ? (
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
      ) : backHref ? (
        <Link href={backHref} className="inline-flex border p-2 rounded-md hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
        </Link>
      ) : null}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            We have sent a {actionText} to:<br />
            <span className="text-blue-600 font-medium">{email}</span>.
          </p>
          <p>{instructions}</p>
          <p className="text-xs">
            If you don't see the email within a few minutes, check your spam or junk folder.
          </p>
        </div>
      </div>
      {footer && <div className="pt-4">{footer}</div>}
    </div>
  );
}
