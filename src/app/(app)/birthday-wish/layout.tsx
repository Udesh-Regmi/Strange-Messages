export const metadata = {
    title: 'Dashboard',
    description: 'See who messaged you !',
  }
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 to-gray-100 bg-opacity-80 backdrop-blur-lg text-black  shadow-lg">

{children}
  
      </div>
  
       
    )
  }
  