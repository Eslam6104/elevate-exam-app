import AuthLayout from "@/features/auth/layout/auth-layout";
import RegisterForm from "@/features/auth/register/components/register-form";

export default function Page() {
    return (
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    );
}