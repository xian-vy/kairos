import { features } from '@/lib/lists'
import React from 'react'

const Features = () => {
  return (
    <div className="py-8 md:py-20 2xl:py-24 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8 xl:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl transition-colors flex flex-col items-center max-w-[250px] md:max-w-[400px] mx-auto"
            >
              <h3 className="text-sm md:text-base 2xl:text-lg text-[#E2E4FF] mb-1.5 sm:mb-3 font-bold font-space-grotesk text-center">
                {feature.title}
              </h3>
              <p className="text-[#B4B7E5] font-space-grotesk text-xs sm:text-sm leading-tight sm:leading-relaxed text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
