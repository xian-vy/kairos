'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaDiscord, FaFacebookMessenger, FaGithub } from "react-icons/fa"
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/auth-helpers-nextjs'
import { GAMESLIST } from '@/lib/data/utils'
import Image from 'next/image'
import { Select, SelectTrigger } from './ui/select'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Navigation = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOutClick = () => {
    setSignOutDialogOpen(true)
  }

  const confirmSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
    router.refresh()
    setSignOutDialogOpen(false)
  }

  const handleSignIn = () => {
    router.push('/auth/signin')
  }

  return (
    <>
      <nav className="border-b border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span onClick={() => router.push('/')} className="cursor-pointer font-space-grotesk mb-0.5 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
                Kairos
              </span>
              <Button variant="ghost" className="ml-3 text-[#E2E4FF] hover:text-black hidden md:block">
                <span className="font-space-grotesk">Guide</span>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Link href="https://discord.com" target="_blank" className="text-[#B4B7E5] hover:text-white">
                <FaDiscord className="h-4 w-4" />
              </Link>
              <Link href="https://github.com" target="_blank" className="text-[#B4B7E5] hover:text-white">
                <FaGithub className="h-4 w-4" />
              </Link>
              <Link href="https://github.com" target="_blank" className="text-[#B4B7E5] hover:text-white">
                <FaFacebookMessenger className="h-4 w-4" />
              </Link>
       
               {!user && (
               <Button 
               variant="ghost" 
               className="text-[#E2E4FF] hover:text-black"
               onClick={handleSignIn}
             >
               <span className="font-space-grotesk">Sign In</span>
             </Button>
              )}
               {user ? (
              <div className="ml-2">
              {GAMESLIST.map((game) => (
               <Select key={game.slug}>
                <SelectTrigger className=" hover:bg-[#1F2137] text-white flex items-center  gap-2 ">
                  <Image src={game.icon} alt={game.name} width={20} height={20} />
                  <span className="font-space-grotesk text-white">{game.name}</span>
                </SelectTrigger>
               </Select>
              ))}
              </div>
              ) : (
                <Button className="bg-[#4B79E4] hover:bg-[#3D63C9] hidden md:block">
                  <span className="font-space-grotesk">Get Started</span>
                </Button>
              )}
             {user && (
                <Button 
                  variant="ghost" 
                  className="text-[#E2E4FF] hover:text-black"
                  onClick={handleSignOutClick}
                >
                  <span className="font-space-grotesk">Sign Out</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
        <AlertDialogContent className="bg-[#090915] border-[#1F2137]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#E2E4FF]">Sign Out</AlertDialogTitle>
            <AlertDialogDescription className="text-[#B4B7E5]">
              Are you sure you want to sign out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#090915] text-[#B4B7E5] hover:bg-[#2A2D4B] hover:text-[#E2E4FF] border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSignOut}
              className="bg-red-700 text-white hover:bg-red-600"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Navigation
