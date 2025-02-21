"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LinearLoading } from "./linear-loading";
import { GlowEffect } from "./ui/glow-effect";
import { Button } from "./ui/button";

const Hero = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleGetStarted = () => {
    startTransition(() => {
      router.push("/app");
    });
  }; 

  return (
    <div className="relative min-h-[400px] 2xl:min-h-[450px] 3xl:min-h-[550px] flex items-center justify-center overflow-hidden">
      <LinearLoading isLoading={isPending} />

      {/* Glowing circle gradient */}
      <div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[900px] xl:w-[750px] 3xl:w-[800px] opacity-25">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4B79E4] via-[#9D68E4] to-[#E45A68] blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 md:pt-16">
        <h1 className="relative font-space-grotesk text-4xl md:text-6xl font-bold mb-1">
          <span className="relative inline-block">
            {/* Subtle glow effect */}
            <span className="absolute -inset-2 blur-2xl bg-gradient-to-r from-[#4B79E4]/20 to-[#9D68E4]/20" />

            {/* Main text with gradient */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl 3xl:text-7xl max-w-[450px] md:max-w-[560px] 3xl:max-w-screen-sm !leading-[1.2] font-extrabold tracking-widest relative bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
                 KAIROS
            </h1>
          </span>
        </h1>
         <h2 className="text-sm xl:text-base 2xl:text-lg  !font-normal text-[#E2E4FF]">The ultimate boss tracking tool for any MMORPG</h2>
         <div className="flex justify-center mt-7 xl:mt-9 2xl:mt-10">
            <div className='relative'>
              <GlowEffect
                  colors={['#E45A68','#9D68E4','#9D68E4','#4B79E4']}
                    mode='rotate'
                    blur='strong'
                    duration={4}
                    scale={0.9}
                  />
                <Button onClick={handleGetStarted} className='relative h-10 2xl:h-11 font-normal rounded-lg 2xl:text-[0.9rem] font-space-grotesk bg-[#0D0F23] '>
                  Get Started Free
                </Button>
              </div>
          </div>
      </div>
     
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C1B] via-transparent to-[#0A0C1B] pointer-events-none" />
    </div>
  );
};

export default Hero;
