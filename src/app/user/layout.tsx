export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="user-container">
      {/* Dashboard-specific layout */}
      {children}
    </div>
  )
}
