import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { FaDiscord, FaFacebookMessenger, FaGithub } from "react-icons/fa";

const Navigation = () => {
  return (
    <nav className="border-b border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <span className="font-space-grotesk mb-0.5 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
            Kairos
          </span>
          <Button variant="ghost" className="ml-3 text-[#E2E4FF] hover:text-black hidden md:block">
            <span className="font-space-grotesk">Guide</span>
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="https://discord.com" target="_blank" className="text-[#B4B7E5] hover:text-white">
            <FaDiscord className="h-4 w-4" />
          </Link>
          <Link href="https://github.com" target="_blank" className="text-[#B4B7E5] hover:text-white">
            <FaGithub className="h-4 w-4" />
          </Link>
          <Link href="https://github.com" target="_blank" className="text-[#B4B7E5] hover:text-white">
            <FaFacebookMessenger className="h-4 w-4" />
          </Link>
          <Button variant="ghost" className="text-[#E2E4FF] hover:text-black">
            <span className="font-space-grotesk">Sign In</span>
          </Button>
          <Button className="bg-[#4B79E4] hover:bg-[#3D63C9] hidden md:block">
            <span className="font-space-grotesk">Get Started</span>
          </Button>
        </div>
      </div>
    </div>
  </nav>
  )
}

export default Navigation
