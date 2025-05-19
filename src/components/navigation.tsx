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
      <nav className=" bg-[#0D0F23]/50 backdrop-blur-sm">
        <LinearLoading isLoading={isPending} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span onClick={handleNavigateToHome} className="cursor-pointer font-space-grotesk mb-0.5 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
              Kairos
            </span>
           
           
            <div className="flex items-center gap-2">
               <Button 
                  onClick={() => setShareDialogOpen(true)} 
                  variant="ghost" 
                  className="text-[#E2E4FF] hover:text-black !px-2"
                >
                  <Share2 aria-label="Share Kairos" className="h-3 w-3" />
                </Button>
              <Button onClick={handleNavigateToGuide} variant="ghost" className=" text-[#E2E4FF] hover:text-black !px-3">
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
