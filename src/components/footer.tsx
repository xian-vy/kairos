'use client'
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { LinearLoading } from './linear-loading';
import { FaDiscord, FaFacebookMessenger, FaGithub } from "react-icons/fa"
import Link from 'next/link';

const Footer = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const handleNavigate = (path: string) => {
    startTransition(() => {
      router.push(path)
    })
  }

  return (
    <footer className="border-t border-[#1F2137] bg-[#0D0F23]">
      <LinearLoading isLoading={isPending} />
      <div className=" px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="cursor-pointer font-space-grotesk mb-0.5 text-sm lg:!text-base 3xl:!text-lg font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
              KAIROS
         </span>
          <p className="text-sm text-[#B4B7E5]/70 font-space-grotesk">Track, notify, collaborate - all in one place</p>
        </div>

        <div className="flex justify-center space-x-5 sm:space-x-8 lg:space-x-10 mb-20 xl:mb-24 max-w-7xl mx-auto">
          <span onClick={() => handleNavigate("/features")} className="text-[#B4B7E5] font-space-grotesk hover:text-white transition-colors duration-200 text-[0.8rem] cursor-pointer">
            Features
          </span>
          <span onClick={() => handleNavigate("/guide")} className="text-[#B4B7E5] font-space-grotesk hover:text-white transition-colors duration-200 text-[0.8rem] cursor-pointer">
            Guide
          </span>
          <span onClick={() => handleNavigate("/about")} className="text-[#B4B7E5] font-space-grotesk hover:text-white transition-colors duration-200 text-[0.8rem] cursor-pointer">
            About
          </span>
          <span onClick={() => handleNavigate("/contact")} className="text-[#B4B7E5] font-space-grotesk hover:text-white transition-colors duration-200 text-[0.8rem] cursor-pointer">
            Contact
          </span>
          <span onClick={() => handleNavigate("/privacy-policy")} className="text-[#B4B7E5] font-space-grotesk hover:text-white transition-colors duration-200 text-[0.8rem] cursor-pointer">
             Privacy 
            </span>
        </div>


        <div className="text-center text-[#B4B7E5] text-sm   max-w-screen-2xl mx-auto">
          <hr/>
          <div className="flex flex-col-reverse gap-5 sm:flex-row w-full justify-between items-center mt-5" >
                <span>© {new Date().getFullYear()} Kairos. All rights reserved.</span>
                <div className="flex items-center gap-5">
                        
                        <div className="flex items-center gap-3">
                            <Link href="https://discord.com/crispysnowflake." aria-label="Discord Link" target="_blank" className="text-[#B4B7E5] hover:text-white">
                                        <FaDiscord className="h-4 w-4" />
                            </Link>
                            <Link href="https://github.com/xian-vy" aria-label="Github Link" target="_blank" className="text-[#B4B7E5] hover:text-white">
                              <FaGithub className="h-4 w-4" />
                            </Link>
                            <Link href="https://facebook.com/xzyian.vy" aria-label="FB Messenger Link" target="_blank" className="text-[#B4B7E5] hover:text-white">
                              <FaFacebookMessenger className="h-4 w-4" />
                            </Link>
                        </div>
                </div>
          </div>
  
        </div>
      </div>
    </footer>
  )
}

export default Footer
