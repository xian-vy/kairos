import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next';
const BASE_URL = "https://kairos-tracker.vercel.app/";

export const generateMetadata = async (): Promise<Metadata> => {
 
   return {
     title: "Kairos | " + "About",
     description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     openGraph: {
       title: "Kairos | " + "About",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
       type: "article",
       url: BASE_URL + "about",
       siteName:"About",
     },
     twitter: {
       card: "summary_large_image",
       title: "Kairos | " + "About",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     },
     alternates: {
       canonical:BASE_URL
     },
   };
 };
export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    "@type": "BlogPosting",
    "headline": "About Kairos",
    "description":" Kairos was created with a simple goal: to make boss tracking in MMORPGs effortless and collaborative. We believe that players should focus on the  excitement of the hunt, not the complexity of timing spawns.",
    url: BASE_URL + "about"
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[70vh] flex flex-col items-center justify-center">
      <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#E2E4FF] text-center">
            About Kairos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-[#B4B7E5]">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Our Mission</h2>
            <p className="text-sm">
              Kairos was created with a simple goal: to make boss tracking in MMORPGs 
              effortless and collaborative. We believe that players should focus on the 
              excitement of the hunt, not the complexity of timing spawns.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Why Kairos?</h2>
            <p className="text-sm">
              Named after the Greek god of opportune moments, Kairos helps you seize 
              the perfect time for every boss encounter. Our tool transforms the 
              challenging task of coordinating boss spawns into a seamless experience 
              for both casual players and hardcore guilds.
            </p>
          </section>

          <div className="text-center pt-6 border-t border-[#1F2137]">
            <p className="text-xs">
              Built with next.js and tailwindcss
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
} 