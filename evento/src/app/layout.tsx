import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // We use class from Tailwind CSS for background color
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <Header />
          {children}
        <Footer />
      </body>
    </html>
  )
}

// Previously when we wanted to style something we had to give it a className and put that in a separate CSS file, but here we can do it directly together with the component

// These CSS classes will be inherited by the components within `<body>` tag, so Header and Footer and all the rest that will be there yet, 
// that is why we are setting in layout.tsx, because every page is a child `{children}` here, Header and Footer will have white text by default

// It is good to know that colors in Tailwind CSS have certain structure
// https://tailwindcss.com/docs/customizing-colors