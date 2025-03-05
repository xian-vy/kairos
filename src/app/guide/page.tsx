import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next';

const BASE_URL = "https://kairos-tracker.vercel.app/";
export const generateMetadata = async (): Promise<Metadata> => {
 
   return {
     title: "Kairos | " + "Guide",
     description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     openGraph: {
       title: "Kairos | " + "Guide",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
       type: "article",
       url: BASE_URL + "Guide",
       siteName:"Guide",
     },
     twitter: {
       card: "summary_large_image",
       title: "Kairos | " + "Guide",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     },
     alternates: {
       canonical:BASE_URL
     },
   };
 };
export default function GuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    "@type": "BlogPosting",
    "headline": "Getting Started",
    "description":"Whether youre a guild leader or a dedicated player, Kairos helps you track boss spawns efficiently and coordinate with your team.",
    url: BASE_URL + "guide"
  }
  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#E2E4FF] text-center">
            Welcome to Kairos! ⚔️
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-[#B4B7E5]">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Getting Started</h2>
            <p className='text-sm'>
              Welcome to Kairos, your ultimate MMORPG boss timer companion! Whether youre a guild leader
              or a dedicated player, Kairos helps you track boss spawns efficiently and coordinate with
              your team.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Creating Your Account</h2>
            <p className='text-sm'>
              1. Click Sign Up on the sign-in page<br />
              2. Choose a username that your teammates will recognize<br />
              3. Enter your email and create a secure password<br />
              4. Verify your email through the confirmation link we ll send you
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Groups & Boss Timers</h2>
            <p className='text-sm'>
              After logging in, you can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create a new group or join an existing one using an invite</li>
              <li>Set up boss timers with custom respawn intervals</li>
              <li>Configure countdown settings (respawn time, delays, etc.)</li>
              <li>Invite other players to join your group</li>
              <li>Track multiple boss timers simultaneously</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Managing Boss Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Set precise respawn intervals for each boss</li>
              <li>Add countdown delays to account for varying spawn windows</li>
              <li>Track kill counts and history</li>
              <li>Customize notifications for upcoming spawns</li>
              <li>Collaborate with your team in real-time</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Pro Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keep your boss timers updated for accurate tracking</li>
              <li>Use the group chat to coordinate with team members</li>
              <li>Set up notifications to never miss important spawns</li>
            </ul>
          </section>

          <section className="space-y-2 mt-8 border-t border-[#1F2137] pt-6">
            <h2 className="text-xl font-semibold text-[#E2E4FF]">Need Help?</h2>
            <p>
              Having issues with Kairos? Were here to help!
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: xianvy0000@gmail.com</li>
              <li>Discord: discord.gg/crispy.snowflake.</li>
              <li>GitHub Issues: github.com/xian-vy</li>
            </ul>
            <p className="mt-4 italic">
              Happy hunting 🗡️
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
    </>
  )
} 