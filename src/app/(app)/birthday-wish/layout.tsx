export const metadata = {
    title: 'Birthday Wish Card',
    description: 'Make your birthday Card for your favorite person !',
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
  