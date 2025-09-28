import Link from 'next/link';
import { FaFacebookMessenger, FaGithub, FaDiscord } from 'react-icons/fa';
import { Metadata } from 'next';
import { Card } from '@/components/ui/card';
const BASE_URL = "https://kairos-tracker.vercel.app/";
export const generateMetadata = async (): Promise<Metadata> => {
 
   return {
     title: "Kairos | " + "Contact",
     description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     openGraph: {
       title: "Kairos | " + "Contact",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
       type: "article",
       url: BASE_URL + "contact/",
       siteName:"Contact",
     },
     twitter: {
       card: "summary_large_image",
       title: "Kairos | " + "Contact",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     },
     alternates: {
       canonical:BASE_URL + "contact/"
     },
   };
 };
export default function Contact() {
  const jsonLd = {
    '@context': 'https://schema.org',
    "@type": "BlogPosting",
    "headline": "Get in Touch",
    "description":"Have questions or feedback? We&apos;d love to hear from you. Get in touch with us through..",
    url: BASE_URL + "contact/"
  }
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="max-w-3xl mx-auto px-4 min-h-[70vh] flex flex-col justify-center pt-24">
    <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm p-8 2xl:p-12 3xl:p-16 flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mb-6 text-[#E2E4FF] bg-gradient-to-r from-[#E2E4FF] to-[#B4B7E5] bg-clip-text text-transparent">
        Contact Us
      </h1>
      
      <div className="w-full max-w-2xl">
        <p className="text-sm text-center mb-8 text-[#B4B7E5] leading-relaxed">
          Have questions or feedback? We&apos;d love to hear from you. Get in touch with us through:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg bg-[#1F2137]/30 flex flex-col items-center transition-transform hover:scale-105">
            <h2 className="text-base font-semibold mb-4 text-[#E2E4FF]">Email</h2>
            <a 
              href="mailto:xianvy0000@gmail.com" 
              className="text-[#B4B7E5] hover:text-white transition-colors text-sm flex items-center gap-2"
            >
              xianvy0000@gmail.com
            </a>
          </div>
      
          <div className="p-6 rounded-lg bg-[#1F2137]/30 flex flex-col items-center transition-transform hover:scale-105">
            <h2 className="text-base font-semibold mb-4 text-[#E2E4FF]">Socials</h2>
            <div className="flex space-x-8">
              <Link
                href="https://discord.com/crispysnowflake"
                target="_blank"
                className="text-[#B4B7E5] hover:text-white transition-colors transform hover:scale-110"
              >
                <FaDiscord size={20} />
              </Link>
              <Link 
                href="https://github.com/xian-vy/kairos" 
                target="_blank" 
                className="text-[#B4B7E5] hover:text-white transition-colors transform hover:scale-110"
              >
                <FaGithub size={20} />
              </Link>
              <Link 
                href="https://www.facebook.com/xzyian.vy" 
                target="_blank" 
                className="text-[#B4B7E5] hover:text-white transition-colors transform hover:scale-110"
              >
                <FaFacebookMessenger size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      </Card>
    </div>
    </>
  );
}