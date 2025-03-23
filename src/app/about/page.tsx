import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next';
import Link from 'next/link';
const BASE_URL = "https://kairos-tracker.vercel.app/";

export const generateMetadata = async (): Promise<Metadata> => {
 
   return {
     title: "Kairos | " + "About",
     description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     openGraph: {
       title: "Kairos | " + "About",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
       type: "article",
       url: BASE_URL + "about/",
       siteName:"About",
     },
     twitter: {
       card: "summary_large_image",
       title: "Kairos | " + "About",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     },
     alternates: {
       canonical:BASE_URL + "about/"
     },
   };
 };
export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    "@type": "BlogPosting",
    "headline": "About Kairos",
    "description":" Kairos was created with a simple goal: to make boss tracking in MMORPGs effortless and collaborative. We believe that players should focus on the  excitement of the hunt, not the complexity of timing spawns.",
    url: BASE_URL + "about/"
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[70vh] flex flex-col items-center justify-center">
      <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm p-5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#E2E4FF] text-center">
              2k per day XD
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-[#B4B7E5]">

            <hr />
            <div className="flex items-center gap-1 text-xs justify-center">
                Developed by
                <Link  href="https://xianvy.vercel.app/" target='_blank' className='hover:underline hover:underline-offset-8'>
                  Xian Vy
                </Link>
            </div>
            <p className="text-xs">
              Built with next.js and tailwindcss
            </p>
        </CardContent>
      </Card>
    </div>
    </>
  )
} 