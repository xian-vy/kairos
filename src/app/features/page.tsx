import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
 const BASE_URL = "https://kairos-tracker.vercel.app/";

  return {
    title: "Kairos | " + "Features",
    description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
    openGraph: {
      title: "Kairos | " + "Features",
      description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
      type: "article",
      url: BASE_URL + "features",
      siteName:"Features",
    },
    twitter: {
      card: "summary_large_image",
      title: "Kairos | " + "Features",
      description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
    },
    alternates: {
      canonical:BASE_URL
    },
  };
};
export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#E2E4FF] text-center">
            Kairos Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-[#B4B7E5]">
          
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Timer Management</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Set precise respawn intervals for each boss</li>
              <li>Configure countdown settings and delays</li>
              <li>Track multiple boss timers simultaneously</li>
              <li>Track kill counts and history</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Group System</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create a new group or join existing ones</li>
              <li>Invite other players to your group</li>
              <li>Collaborate with your team in real-time</li>
              <li>Share boss timers with your team</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Notifications</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Receive alerts for upcoming spawns</li>
              <li>Customize notification settings</li>
              <li>Never miss important spawn windows</li>
            </ul>
          </section>

          <div className="text-center pt-6 border-t border-[#1F2137]">
            <p className="text-xs italic">
            The ultimate boss tracking tool for any MMORPG
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 