import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
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
        <small>© 2024 Kairos. All rights reserved.</small>
      </div>
    </div>
  </footer>
  )
}

export default Footer
