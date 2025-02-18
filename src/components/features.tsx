import { features } from '@/lib/lists'
import React from 'react'

const Features = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-5 2xl:gap-x-8 ">
        {features.map((feature, index) => (
            <div
            key={index}
            className="relative group bg-[#0D0F23] backdrop-blur-sm p-8 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl flex flex-col items-center"
            >
            <div className="mb-5 inline-block rounded-lg bg-[#4B79E4]/10 p-3">{feature.icon}</div>
            <h3 className="text-sm md:text-base 3xl:text-lg font-semibold text-white mb-3 group-hover:text-[#4B79E4] transition-colors duration-300">
                {feature.title}
            </h3>
            <p className="text-[#B4B7E5] text-xs sm:text-sm leading-relaxed text-center">{feature.description}</p>
            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-8 sm:h-16 bg-gradient-to-t from-[#0A0C1B] to-transparent rounded-b-xl" />
            </div>
        ))}
        </div>
     </div>
  )
}

export default Features
