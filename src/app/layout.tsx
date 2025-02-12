import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
