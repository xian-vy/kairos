import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"
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
  keywords: ["MMORPG", "Boss Tracking", "Boss Timer", "Night Crows Boss Tracking", "Kildebat", "MMORPG Boss Tracking Tool", "Kairos"],
  authors: [{ name: "Kairos", url: "xianvy.vercel.app" }],
  creator: "Kairos",
  themeColor: "#0A0C1B",
  icons: {
    icon: "/favicon.ico",
  },
  other: { 
    'google-adsense-account': 'ca-pub-3830709842288861', 
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (   
    <html lang="en">
      <body className={`min-h-screen bg-[#0A0C1B] ${spaceGrotesk.variable} ${inter.variable} font-inter antialiased`}>
       <Navigation />
        {children}
        <Footer />
        <Toaster />
       </body>
       <Analytics />
    </html>
  );
}
