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
       url: BASE_URL + "guide/",
       siteName:"Guide",
     },
     twitter: {
       card: "summary_large_image",
       title: "Kairos | " + "Guide",
       description: "A flexible boss tracking tool for any MMORPG. Night Crows Boss Tracking Tool.",
     },
     alternates: {
       canonical:BASE_URL + "guide/"
     },
   };
 };
export default function GuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    "@type": "BlogPosting",
    "headline": "Getting Started",
    "description":"Whether youre a guild leader or a dedicated player, Kairos helps you track boss spawns efficiently and coordinate with your team.",
    url: BASE_URL + "guide/"
  }
  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-4xl mx-auto px-4 pb-12 pt-24">
      <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm p-2 sm:p-4 md:p-8 2xl:p-12 3xl:p-16">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#E2E4FF] text-center">
            Welcome to Kairos! ⚔️
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold text-[#E2E4FF] mb-4">Getting Started</h2>
            <p className='text-[#B4B7E5] leading-relaxed text-xs sm:text-sm'>
              Welcome to Kairos, your ultimate MMORPG boss timer companion! Whether youre a guild leader
              or a dedicated player, Kairos helps you track boss spawns efficiently and coordinate with
              your team.
            </p>
          </section>

          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold text-[#E2E4FF] mb-4">Creating Your Account</h2>
            <div className='text-[#B4B7E5] leading-relaxed space-y-2 text-xs sm:text-sm'>
              1. Click Sign Up on the sign-in page<br />
              2. Choose a username that your teammates will recognize<br />
              3. Enter your email and create a secure password<br />
              4. Verify your email through the confirmation link we ll send you
            </div>
          </section>

          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold text-[#E2E4FF] mb-4">Groups & Boss Timers</h2>
            <div className="space-y-4 text-[#B4B7E5]">
              <p className='leading-relaxed'>After logging in, you can:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="transition-transform hover:translate-x-2">Create a new group or join an existing one using an invite</li>
                <li className="transition-transform hover:translate-x-2">Set up boss timers with custom respawn intervals</li>
                <li className="transition-transform hover:translate-x-2">Configure countdown settings (respawn time, delays, etc.)</li>
                <li className="transition-transform hover:translate-x-2">Invite other players to join your group</li>
                <li className="transition-transform hover:translate-x-2">Track multiple boss timers simultaneously</li>
              </ul>
            </div>
          </section>

          <section className="rounded-lg bg-[#1F2137]/30 p-6">
            <h2 className="text-xl font-semibold text-[#E2E4FF] mb-4">Managing Boss Data</h2>
            <ul className="list-disc pl-6 space-y-2 text-[#B4B7E5]">
              <li>Set precise respawn intervals for each boss</li>
              <li>Add countdown delays to account for varying spawn windows</li>
              <li>Track kill counts and history</li>
              <li>Customize notifications for upcoming spawns</li>
              <li>Collaborate with your team in real-time</li>
            </ul>
          </section>

          <section className="rounded-lg bg-[#1F2137]/30 p-6 mt-8">
            <h2 className="text-xl font-semibold text-[#E2E4FF] mb-4">Need Help?</h2>
            <div className="space-y-4 text-[#B4B7E5]">
              <p className="leading-relaxed">Having issues with Kairos? Were here to help!</p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="transition-transform hover:translate-x-2">Email: xianvy0000@gmail.com</li>
                <li className="transition-transform hover:translate-x-2">Discord: discord.gg/crispy.snowflake.</li>
                <li className="transition-transform hover:translate-x-2">GitHub Issues: github.com/xian-vy</li>
              </ul>
              <p className="mt-4 italic">Happy hunting 🗡️</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
    </>
  )
}