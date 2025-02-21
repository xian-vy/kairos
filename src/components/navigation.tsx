'use client'
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useCurrentUser from '@/hooks/useCurrentUser'
import { useGroupStore } from "@/stores/groupStore"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { FaDiscord, FaFacebookMessenger, FaGithub, FaUser } from "react-icons/fa"
import { LinearLoading } from "./linear-loading"

const Navigation = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)
  const { currentUser } = useCurrentUser();
  const {userData}= useGroupStore();
  const [isPending, startTransition] = useTransition();

  const handleSignOutClick = () => {
    setSignOutDialogOpen(true)
  }

  const confirmSignOut = async () => {
      startTransition(() => {
        supabase.auth.signOut()
        router.push('/auth/signin')
        router.refresh()
      })
  }

  const handleNavigateToGuide = ()=> {
    startTransition(() => {
      router.push("/guide");
    });
  }
  const handleNavigateToHome = ()=>{
    startTransition(() => {
      router.push("/");
    });
  }
  return (
    <>
      <nav className="border-b border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
      <LinearLoading isLoading={isPending} />


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
              <span onClick={handleNavigateToHome} className="cursor-pointer font-space-grotesk mb-0.5 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
                Kairos
              </span>
         
           
            <div className="flex items-center gap-4">
               {!currentUser && (
                      <>
                      <Link href="https://discord.com/crispysnowflake." aria-label="Discord Link" target="_blank" className="text-[#B4B7E5] hover:text-white">
                        <FaDiscord className="h-4 w-4" />
                      </Link>
                      <Link href="https://github.com/xian-vy" aria-label="Github Link" target="_blank" className="text-[#B4B7E5] hover:text-white">
                        <FaGithub className="h-4 w-4" />
                      </Link>
                      <Link href="https://facebook.com/xzyian.vy" aria-label="FB Messenger Link" target="_blank" className="text-[#B4B7E5] hover:text-white">
                        <FaFacebookMessenger className="h-4 w-4" />
                      </Link>
                      </>
                )}
              <Button onClick={handleNavigateToGuide} variant="ghost" className=" text-[#E2E4FF] hover:text-black !px-2">
                <span className="font-space-grotesk 3xl:text-sm">Guide</span>
              </Button>
               {currentUser && (
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-[#1F2137] uppercase text-[#B4B7E5]">
                          {currentUser.email?.[0] || <FaUser className="h-4 w-4 text-[#B4B7E5]" />}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-[#0D0F23] border-[#1F2137] p-2">
                      <DropdownMenuLabel className="text-[#E2E4FF]">
                        <div className="flex flex-col">
                          <span className="font-medium">Email</span>
                          <span className="text-xs text-[#B4B7E5]">{currentUser.email}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuLabel className="text-[#E2E4FF]">
                        <div className="flex flex-col">
                          <span className="font-medium">Username</span>
                          <span className="text-xs text-[#B4B7E5]">{userData?.username}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[#1F2137]" />
                      <DropdownMenuItem
                        className="text-[#E2E4FF] text-xs focus:bg-[#1F2137] focus:text-[#E2E4FF] cursor-pointer"
                        onClick={handleSignOutClick}
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
          <AlertDialogFooter className="flex flex-row w-full justify-between items-center">
            <AlertDialogCancel 
              className="bg-[#090915] text-[#B4B7E5] mt-0 hover:bg-[#2A2D4B] hover:text-[#E2E4FF] border-none"
              disabled={isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSignOut}
              className="bg-red-700 h-8 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sign Out'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Navigation
