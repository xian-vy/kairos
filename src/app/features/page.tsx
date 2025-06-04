import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next';

const BASE_URL = "https://kairos-tracker.vercel.app/";
export const generateMetadata = async (): Promise<Metadata> => {

  return {
    title: "Kairos | " + "Features",
    description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
    openGraph: {
      title: "Kairos | " + "Features",
      description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
      type: "article",
      url: BASE_URL + "features/",
      siteName:"Features",
    },
    twitter: {
      card: "summary_large_image",
      title: "Kairos | " + "Features",
      description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
    },
    alternates: {
      canonical:BASE_URL + "features/"
    },
  };
};
export default function FeaturesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    "@type": "BlogPosting",
    "headline": "Features",
    "description":"Set precise respawn intervals for each boss, Configure countdown settings and delays.",
    url: BASE_URL + "features/"
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm p-2 sm:p-4 md:p-8 2xl:p-12 3xl:p-16">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#E2E4FF] bg-gradient-to-r from-[#E2E4FF] to-[#B4B7E5] bg-clip-text text-transparent text-center">
               Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <section className="rounded-lg bg-[#1F2137]/30 p-6">
              <h2 className="text-xl font-semibold text-[#E2E4FF] mb-4">Timer Management</h2>
              <ul className="list-disc pl-6 space-y-2 text-[#B4B7E5]">
                <li className="transition-transform hover:translate-x-2">Set precise respawn intervals for each boss</li>
                <li className="transition-transform hover:translate-x-2">Configure countdown settings and delays</li>
                <li className="transition-transform hover:translate-x-2">Track multiple boss timers simultaneously</li>
                <li className="transition-transform hover:translate-x-2">Track kill counts and history</li>
              </ul>
            </section>

            <section className="rounded-lg bg-[#1F2137]/30 p-6">
              <h2 className="text-xl font-semibold text-[#E2E4FF] mb-4">Group System</h2>
              <ul className="list-disc pl-6 space-y-2 text-[#B4B7E5]">
                <li className="transition-transform hover:translate-x-2">Create a new group or join existing ones</li>
                <li className="transition-transform hover:translate-x-2">Invite other players to your group</li>
                <li className="transition-transform hover:translate-x-2">Collaborate with your team in real-time</li>
                <li className="transition-transform hover:translate-x-2">Share boss timers with your team</li>
              </ul>
            </section>

            <section className="rounded-lg bg-[#1F2137]/30 p-6">
              <h2 className="text-xl font-semibold text-[#E2E4FF] mb-4">Notifications</h2>
              <ul className="list-disc pl-6 space-y-2 text-[#B4B7E5]">
                <li className="transition-transform hover:translate-x-2">Receive alerts for upcoming spawns</li>
                <li className="transition-transform hover:translate-x-2">Customize notification settings</li>
                <li className="transition-transform hover:translate-x-2">Never miss important spawn windows</li>
              </ul>
            </section>

          </CardContent>
        </Card>
      </div>
    </>
  )
}