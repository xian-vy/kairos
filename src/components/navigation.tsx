'use client'
import { Button } from '@/components/ui/button'
import useCurrentUser from '@/hooks/useCurrentUser'
import { useGroupStore } from "@/stores/groupStore"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Share2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import AccountMenu from './account-menu'
import { LinearLoading } from "./linear-loading"
import { ShareDialog } from "./share-dialog"
import SignOutDialog from './signout-dialog'

const Navigation = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)
  const { currentUser } = useCurrentUser();
  const {userData}= useGroupStore();
  const [isPending, startTransition] = useTransition();
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

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
      <nav className="fixed top-0 left-0 right-0 z-10 border-b border-[#1F2137]  bg-[#0D0F23]/50 backdrop-blur-sm">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px]  lg:w-[700px] xl:w-[750px] 3xl:w-[800px] h-[150px]  opacity-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4B79E4] via-[#9D68E4] to-[#E45A68] blur-3xl" />
      </div>
        <LinearLoading isLoading={isPending} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span onClick={handleNavigateToHome} className="cursor-pointer font-space-grotesk mb-0.5 text-sm lg:!text-base 3xl:!text-lg font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
              KAIROS
            </span>
           
           
            <div className="flex items-center gap-1 z-50">
               <Button 
                  onClick={() => setShareDialogOpen(true)} 
                  variant="ghost" 
                  className="text-[#E2E4FF] hover:text-black !px-2"
                >
                  <Share2 aria-label="Share Kairos" className="!h-4 !w-4" />
                </Button>
              <Button onClick={handleNavigateToGuide} variant="ghost" className=" text-[#E2E4FF] hover:text-black !px-2">
                <span className="font-space-grotesk 3xl:text-sm">Guide</span>
              </Button>
               {currentUser && (
                <div className="flex items-center gap-4">
                  <AccountMenu 
                    currentUser={currentUser}
                    userData={userData}
                    onSignOutClick={handleSignOutClick}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} />

      <SignOutDialog 
        open={signOutDialogOpen}
        onOpenChange={setSignOutDialogOpen}
        onConfirm={confirmSignOut}
        isPending={isPending}
      />
    </>
  )
}

export default Navigation
