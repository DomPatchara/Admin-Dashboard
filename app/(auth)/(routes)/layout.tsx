export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#F2EFE7] flex items-center justify-center min-h-screen">
      {children}
    </div>
  )
}   