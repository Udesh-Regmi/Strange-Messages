export const metadata = {
  title: 'Anonymous Message',
  description: 'Send Anonymous messages to the user just by registering to the page without revealing your identity...',

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="user-container">
      {children}
    </div>
  )
}
