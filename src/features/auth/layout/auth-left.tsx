import AuthHero from "../components/auth-hero/auth-hero";

export default function AuthLeft() {
  return (
    <div
      className="
      hidden
      lg:flex
      bg-(--auth-bg)
      items-center
      "
    >
      <div className="max-w-xl px-24 py-29">
        <AuthHero />
      </div>
    </div>
  );
}