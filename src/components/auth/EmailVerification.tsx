'use client'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/hooks/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Mail } from 'lucide-react'
import { useState } from 'react'

interface EmailVerificationProps {
  email: string
  turnstileToken: string | null
}

export function EmailVerification({ email, turnstileToken }: EmailVerificationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleResendVerification = async () => {
    if (!email) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          captchaToken: turnstileToken || undefined
        }
      })
      
      if (error) throw error
      
      toast({
        title: "Verification Email Sent",
        description: "Please check your email (including spam folder) for the verification link.",
      })
    } catch (error) {
      console.error('Error resending verification:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to resend verification email',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 bg-[#1F2137] rounded-lg space-y-3">
      <p className="text-xs text-[#B4B7E5] text-center">
        Your email address needs to be verified before you can sign in.
      </p>
      <Button
        type="button"
        onClick={handleResendVerification}
        disabled={isLoading}
        className="w-full bg-[#4B79E4] hover:bg-[#3D63C9] text-white"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Resend Verification Email
      </Button>
    </div>
  )
}
