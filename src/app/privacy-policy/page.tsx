import { Card } from '@/components/ui/card';
import { Metadata } from 'next';
import React from 'react';
const BASE_URL = "https://kairos-tracker.vercel.app/";
export const generateMetadata = async (): Promise<Metadata> => {
 
   return {
     title: "Kairos | " + "Privacy Policy",
     description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     openGraph: {
       title: "Kairos | " + "Privacy Policy",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
       type: "article",
       url: BASE_URL + "privacy-policy/",
       siteName:"Privacy Policy",
     },
     twitter: {
       card: "summary_large_image",
       title: "Kairos | " + "Privacy Policy",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     },
     alternates: {
       canonical:BASE_URL + "privacy-policy/"
     },
   };
 };
export default function PrivacyPolicy() {
  const jsonLd = {
    '@context': 'https://schema.org',
    "@type": "BlogPosting",
    "headline": "Privacy Policy",
    "description":"This Privacy Policy describes how we collect, use, and handle your information when you use our services.",
    url: BASE_URL + "privacy-policy/"
  }
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="max-w-4xl mx-auto px-4 pb-12  pt-24">
      <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm p-8 2xl:p-12 3xl:p-16">
        <h1 className="text-xl font-bold mb-8 text-[#E2E4FF] bg-gradient-to-r from-[#E2E4FF] to-[#B4B7E5] bg-clip-text text-transparent text-center">
          Privacy Policy
        </h1>
        
        <div className="space-y-8">
          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#E2E4FF]">Last Updated: {new Date().toLocaleDateString()}</h2>
            <p className="text-[#B4B7E5] leading-relaxed">
              This Privacy Policy describes how we collect, use, and handle your information when you use our services.
            </p>
          </section>

          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#E2E4FF]">Information We Collect</h2>
            <h3 className="text-lg font-medium mb-2 text-[#E2E4FF]">Account Information</h3>
            <p className="text-[#B4B7E5] leading-relaxed">
              When you create an account, we collect your email address and securely store your password. 
              This information is processed and stored by Supabase, our authentication service provider.
            </p>
          </section>

          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#E2E4FF]">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-[#B4B7E5]">
              <li className="transition-transform hover:translate-x-2">To provide and maintain our service</li>
              <li className="transition-transform hover:translate-x-2">To authenticate your access to your account</li>
              <li className="transition-transform hover:translate-x-2">To communicate with you about service-related issues</li>
              <li className="transition-transform hover:translate-x-2">To improve and optimize our service</li>
            </ul>
          </section>

          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#E2E4FF]">Data Security</h2>
            <p className="text-[#B4B7E5] leading-relaxed">
              We implement appropriate security measures to protect your personal information. 
              Your password is encrypted, and we use secure protocols for data transmission.
            </p>
          </section>

          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#E2E4FF]">Your Rights</h2>
            <p className="text-[#B4B7E5] mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-[#B4B7E5]">
              <li className="transition-transform hover:translate-x-2">Access your personal information</li>
              <li className="transition-transform hover:translate-x-2">Correct inaccurate information</li>
              <li className="transition-transform hover:translate-x-2">Request deletion of your information</li>
              <li className="transition-transform hover:translate-x-2">Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#E2E4FF]">Contact Us</h2>
            <p className="text-[#B4B7E5] leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a 
                href="mailto:xianvy0000@gmail.com"
                className="text-[#E2E4FF] hover:text-white transition-colors underline decoration-dotted"
              >
                xianvy0000@gmail.com
              </a>
            </p>
          </section>
        </div>
      </Card>
    </div>
    </>
  );
}