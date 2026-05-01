import { redirect } from "next/navigation";

export default function AccountSettingsRedirect() {
  redirect("/student/account/profile");
}
