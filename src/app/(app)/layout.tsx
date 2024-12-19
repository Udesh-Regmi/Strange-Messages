export const metadata = {
    title: 'Home',
    description: 'Welcome to Home',
  }
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
<div className="min-h-screen flex flex-col align-middle justify-center  app-route bg-gradient-to-r from-blue-500 to-zinc-200 bg-opacity-50 backdrop-blur-lg text-white rounded-lg shadow-lg">

{children}
  
      </div>
  
       
    )
  }
  