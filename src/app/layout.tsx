import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kairos - MMORPG Boss Tracking Tool",
  description: "A flexible boss tracking tool for any MMORPG",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // Add protected routes here
  const protectedPaths = ['/protected-route-1', '/protected-route-2']
  const currentPath = headers().get('x-pathname') || '/'

  if (!session && protectedPaths.includes(currentPath)) {
    redirect('/auth/signin')
  }

  return (   
    <html lang="en">
      <body className={`min-h-screen bg-[#0A0C1B] ${spaceGrotesk.variable} ${inter.variable} font-inter antialiased`}>
       <Navigation />
        {children}
        <Footer />
       </body>
    </html>
  );
}
