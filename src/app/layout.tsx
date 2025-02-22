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
  description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
  keywords: ["MMORPG Tool", "Boss Tracking Tool", "Boss Timer", "Night Crows Boss Tracking", "Kildebat", "MMORPG Boss Tracking Tool", "Kairos  Boss Tracking Tool"],
  authors: [{ name: "Kairos", url: "kairos-tracker.vercel.app" }],
  creator: "Kairos",
  themeColor: "#0A0C1B",
  icons: {
    icon: "/favicon.ico?v=2",
  },
  openGraph: {
    title: "Kairos - MMORPG Boss Tracking Tool",
    description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
    url: "https://kairos-tracker.vercel.app",
    images: [
      {
        url: "/kairos.jpeg",
        alt: "Kairos - MMORPG Boss Tracking Tool",
      },
    ],
    siteName: "Kairos - MMORPG Boss Tracking Tool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kairos - MMORPG Boss Tracking Tool",
    description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
    images: "/kairos.jpeg",
  },
  other: { 
    'google-adsense-account': 'ca-pub-3830709842288861', 
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://kairos-tracker.vercel.app/",
  },
  manifest: "/manifest.json",
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
