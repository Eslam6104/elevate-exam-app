export default function AuthRight({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
      flex
      items-center
      justify-center
      px-6
      lg:px-0
      "
    >
      {children}
    </div>
  );
}