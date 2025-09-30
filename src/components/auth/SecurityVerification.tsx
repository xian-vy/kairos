'use client'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/hooks/use-toast'
import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import Turnstile from "react-turnstile"

interface SecurityVerificationProps {
  onTokenChange: (token: string | null) => void
  token: string | null
}

export function SecurityVerification({ onTokenChange, token }: SecurityVerificationProps) {
  const [showTurnstile, setShowTurnstile] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const handleTurnstileSuccess = (turnstileToken: string) => {
    onTokenChange(turnstileToken)
    setIsVerifying(false)
  }

  const handleVerifyClick = () => {
    setIsVerifying(true)
    setShowTurnstile(true)
  }

  const resetVerification = () => {
    onTokenChange(null)
    setShowTurnstile(false)
    setIsVerifying(false)
  }

  return (
    <>
      {!token ? (
        <Button 
          type="button"
          onClick={handleVerifyClick}
          disabled={isVerifying}
          className="bg-[#4B79E4] hover:bg-[#3D63C9] text-white"
        >
          {isVerifying ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className='w-3 h-3 mr-2'/> Im not a robot
            </>
          )}
        </Button>
      ) : (
        <div className="text-xs text-emerald-400 text-center">
          ✓ Verification Complete
        </div>
      )}

      {showTurnstile && (
        <div className="hidden">
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
            onVerify={handleTurnstileSuccess}
            onError={() => {
              toast({
                title: "Error",
                description: "Failed to load security check. Please try again.",
              })
              setShowTurnstile(false)
            }}
            onExpire={() => {
              toast({
                title: "Verification Expired",
                description: "Please complete the security check again.",
              })
              onTokenChange(null)
            }}
            theme="dark"
            refreshExpired="auto"
          />
        </div>
      )}
    </>
  )
}
