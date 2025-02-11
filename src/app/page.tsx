import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Timer, Bell, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0C1B]">
      {/* Navigation */}
      <nav className="border-b border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-space-grotesk text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
                Kairos
              </span>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <Link href="/guide" className="text-[#B4B7E5] hover:text-white font-space-grotesk">
                    Guide
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-[#E2E4FF] hover:text-white">
                <span className="font-space-grotesk">Sign In</span>
              </Button>
              <Button className="bg-[#4B79E4] hover:bg-[#3D63C9]">
                <span className="font-space-grotesk">Get Started</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-[600px] md:min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Glowing circle gradient */}
        <div className="absolute w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] opacity-25">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4B79E4] via-[#9D68E4] to-[#E45A68] blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 md:pt-20">
          <h1 className="relative font-space-grotesk text-4xl md:text-6xl font-bold mb-4">
            <span className="relative inline-block">
              {/* Subtle glow effect */}
              <span className="absolute -inset-2 blur-2xl bg-gradient-to-r from-[#4B79E4]/20 to-[#9D68E4]/20" />

              {/* Main text with gradient */}
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
                Kairos
              </span>

              {/* Bottom shine effect */}
              <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4B79E4]/50 to-transparent" />
            </span>
          </h1>
          <p className="text-base md:text-lg text-[#B4B7E5]/90 max-w-2xl mx-auto mb-8">
            The ultimate boss tracking tool for any MMORPG
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="relative bg-[#4B79E4] text-white 
                hover:bg-[#3D63C9] 
                transform transition-all duration-200 
                px-8 py-5 text-base font-medium rounded-xl
                shadow-lg hover:shadow-xl overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 animate-shine" />
            </Button>
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C1B] via-transparent to-[#0A0C1B] pointer-events-none" />
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group bg-[#0D0F23] backdrop-blur-sm p-8 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl">
            <div className="mb-5 inline-block rounded-lg bg-[#4B79E4]/10 p-3">
              <Timer className="h-6 w-6 text-[#4B79E4]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#4B79E4] transition-colors duration-300">
              Universal Tracking
            </h3>
            <p className="text-[#B4B7E5] text-sm leading-relaxed">
              Track boss spawns and timers across any MMORPG with our flexible tracking system
            </p>
            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0C1B] to-transparent rounded-b-xl" />
          </div>

          <div className="relative group bg-[#0D0F23] backdrop-blur-sm p-8 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl">
            <div className="mb-5 inline-block rounded-lg bg-[#9D68E4]/10 p-3">
              <Bell className="h-6 w-6 text-[#9D68E4]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#9D68E4] transition-colors duration-300">
              Real-time Updates
            </h3>
            <p className="text-[#B4B7E5] text-sm leading-relaxed">
              Get instant notifications and updates for your tracked bosses
            </p>
            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0C1B] to-transparent rounded-b-xl" />
          </div>

          <div className="relative group bg-[#0D0F23] backdrop-blur-sm p-8 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl">
            <div className="mb-5 inline-block rounded-lg bg-[#E45A68]/10 p-3">
              <Users className="h-6 w-6 text-[#E45A68]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#E45A68] transition-colors duration-300">
              Community Driven
            </h3>
            <p className="text-[#B4B7E5] text-sm leading-relaxed">
              Share and collaborate with other players in real-time
            </p>
            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0C1B] to-transparent rounded-b-xl" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1F2137] bg-[#0D0F23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5] mb-2">
              Kairos
            </span>
            <p className="text-sm text-[#B4B7E5]/70">Track, notify, collaborate - all in one place</p>
          </div>

          <div className="flex justify-center space-x-8 mb-12">
            <Link href="#features" className="text-[#B4B7E5] hover:text-white transition-colors duration-200 text-sm">
              Features
            </Link>
            <Link href="/guide" className="text-[#B4B7E5] hover:text-white transition-colors duration-200 text-sm">
              Guide
            </Link>
            <Link href="/about" className="text-[#B4B7E5] hover:text-white transition-colors duration-200 text-sm">
              About
            </Link>
          </div>

          <div className="text-center text-[#B4B7E5]/60 text-sm">
            <p>© 2024 Kairos. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
