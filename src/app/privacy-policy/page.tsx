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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-[#E2E4FF]">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#E2E4FF]">Last Updated: {new Date().toLocaleDateString()}</h2>
        <p className="mb-4 text-[#B4B7E5]">
          This Privacy Policy describes how we collect, use, and handle your information when you use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#E2E4FF]">Information We Collect</h2>
        <h3 className="text-xl font-medium mb-2 text-[#E2E4FF]">Account Information</h3>
        <p className="mb-4 text-[#B4B7E5]">
          When you create an account, we collect your email address and securely store your password. 
          This information is processed and stored by Supabase, our authentication service provider.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#E2E4FF]">Advertising</h2>
        <p className="mb-4 text-[#B4B7E5]">
          We use Google AdSense to display advertisements on our website. Google AdSense may use cookies 
          and other technologies to serve you relevant advertisements. This process involves collecting 
          and using information about your website usage. You can learn more about Google practices at 
          <a href="https://policies.google.com/technologies/partner-sites" className="text-[#E2E4FF] hover:text-white transition-colors ml-1">
            Google&apos;s Privacy & Terms
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#E2E4FF]">How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 text-[#B4B7E5]">
          <li>To provide and maintain our service</li>
          <li>To authenticate your access to your account</li>
          <li>To communicate with you about service-related issues</li>
          <li>To improve and optimize our service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#E2E4FF]">Data Security</h2>
        <p className="mb-4 text-[#B4B7E5]">
          We implement appropriate security measures to protect your personal information. 
          Your password is encrypted, and we use secure protocols for data transmission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#E2E4FF]">Your Rights</h2>
        <p className="mb-4 text-[#B4B7E5]">
          You have the right to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-[#B4B7E5]">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#E2E4FF]">Contact Us</h2>
        <p className="mb-4 text-[#B4B7E5]">
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a 
            href="mailto:xianvy0000@gmail.com"
            className="text-[#E2E4FF] hover:text-white transition-colors"
          >
            xianvy0000@gmail.com
          </a>.
        </p>
      </section>
    </div>
    </>
  );
} 