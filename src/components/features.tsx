import { features } from '@/lib/lists'
import React from 'react'

const Features = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 sm:gap-y-4 gap-x-3 sm:gap-x-5 md:gap-x-8 ">
        {features.map((feature, index) => (
            <div
            key={index}
            className="relative  bg-[#0D0F23] backdrop-blur-sm p-4 md:p-8 rounded-xl transition-colors flex flex-col items-center"
            >
            <div className="mb-5 inline-block rounded-lg bg-[#4B79E4]/10 p-3">{feature.icon}</div>
            <h3 className="text-sm md:text-base 3xl:text-lg font-semibold text-[#E2E4FF] mb-1.5 sm:mb-3 text-center">
                {feature.title}
            </h3>
            <p className="text-[#B4B7E5] text-xs sm:text-sm leading-tight sm:leading-relaxed text-center">{feature.description}</p>
            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-8 sm:h-16 bg-gradient-to-t from-[#0A0C1B] to-transparent rounded-b-xl" />
            </div>
        ))}
        </div>
     </div>
  )
}

export default Features
