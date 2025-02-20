'use client'
import { useTransition } from 'react';
import { LinearLoading } from './linear-loading';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const handleNavigate = ( path : string)=>{
    startTransition(()=>{
      router.push(path)
    })
  }

  return (
    <footer className="border-t border-[#1F2137] bg-[#0D0F23]">
    <LinearLoading isLoading={isPending} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="font-space-grotesk text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5] mb-2">
              Kairos
            </span>
            <p className="text-sm text-[#B4B7E5]/70 font-space-grotesk">Track, notify, collaborate - all in one place</p>
          </div>

          <div className="flex justify-center space-x-8 mb-12">
            <span onClick={()=> handleNavigate("/features")} className="text-[#B4B7E5] font-space-grotesk hover:text-white transition-colors duration-200 text-sm cursor-pointer">
              Features
            </span>
            <span onClick={()=> handleNavigate("/guide")} className="text-[#B4B7E5] font-space-grotesk hover:text-white transition-colors duration-200 text-sm cursor-pointer">
              Guide
            </span>
            <span onClick={()=> handleNavigate("/about")} className="text-[#B4B7E5] font-space-grotesk hover:text-white transition-colors duration-200 text-sm cursor-pointer">
              About
            </span>
          </div>

          <div className="text-center text-[#B4B7E5] text-sm">
            <small>© {new Date().getFullYear()} Kairos. All rights reserved.</small>
          </div>
        </div>
  </footer>
  )
}

export default Footer
