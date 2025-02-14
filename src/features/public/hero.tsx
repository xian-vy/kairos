'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useRouter } from 'next/navigation'

const Hero = () => {
  const router = useRouter()
  return (
    <div className="relative min-h-[400px] 2xl:min-h-[550px] flex items-center justify-center overflow-hidden">
    {/* Glowing circle gradient */}
    <div className="absolute w-[800px] h-[800px] md:w-[900px] md:h-[900px] opacity-25">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4B79E4] via-[#9D68E4] to-[#E45A68] blur-3xl" />
    </div>

    {/* Content */}
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 md:pt-20">
      <h1 className="relative font-space-grotesk text-4xl md:text-6xl font-bold mb-4">
        <span className="relative inline-block">
          {/* Subtle glow effect */}
          <span className="absolute -inset-2 blur-2xl bg-gradient-to-r from-[#4B79E4]/20 to-[#9D68E4]/20" />

          {/* Main text with gradient */}
          <h1 className="text-5xl relative bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
            Kairos
            <small className='text-[0.65rem] font-normal text-[#B4B7E5] ml-0.5'>beta</small>
          </h1>

          {/* Bottom shine effect */}
          <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4B79E4]/50 to-transparent" />
        </span>
      </h1>
      <p className="text-base md:text-lg text-[#B4B7E5]/90 max-w-2xl mx-auto mb-8">
        The ultimate boss tracking tool for any MMORPG
      </p>
      <div className="flex justify-center">
        <Button
         onClick={() => router.push('/app')}
          size="lg"
          className="relative bg-[#4B79E4] text-white 
            hover:bg-[#3D63C9] 
            transform transition-all duration-200 
            px-8 py-5 text-base font-medium rounded-lg
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
  )
}

export default Hero
