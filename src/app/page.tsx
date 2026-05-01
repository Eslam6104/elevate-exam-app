import AuthLayout from "@/features/auth/layout/auth-layout";
import LoginForm from "@/features/auth/components/login-form";

export default function Page() {
  return (
 <>
 <AuthLayout>
  <LoginForm/>
 </AuthLayout>
 </>
  );
}