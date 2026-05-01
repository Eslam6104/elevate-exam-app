import AuthLeft from "./auth-left";
import AuthRight from "./auth-right";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
      min-h-screen
      grid
      grid-cols-1
      lg:grid-cols-2
    "
    >
      <AuthLeft />

      <AuthRight>{children}</AuthRight>
    </div>
  );
}