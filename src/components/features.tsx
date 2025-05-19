import { features } from '@/lib/lists'
import React from 'react'

const Features = () => {
  return (
    <div className="py-16 md:py-20 2xl:py-24 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-space-grotesk font-bold mb-12 relative bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
          Key Features
        </h2> */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8 xl:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl transition-colors flex flex-col items-center "
            >
              <div className=" sm:mb-2 md:mb-3 xl:mb-5 inline-block rounded-lg  p-3">{feature.icon}</div>
              <h3 className="text-sm md:text-base 3xl:text-lg text-[#E2E4FF] mb-1.5 sm:mb-3 font-normal font-space-grotesk text-center">
                {feature.title}
              </h3>
              <p className="text-[#B4B7E5] font-space-grotesk text-xs sm:text-sm leading-tight sm:leading-relaxed text-center">
                {feature.description}
              </p>
              {/* Gradient Overlay */}
              <div className="absolute hidden sm:block inset-x-0 bottom-0 h-8 sm:h-12 3xl:h-14 bg-gradient-to-t from-[#0A0C1B] to-transparent rounded-b-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
