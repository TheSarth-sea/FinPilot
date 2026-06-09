export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="relative z-10 w-full max-w-md mx-4">{children}</div>
    </div>
  );
}
