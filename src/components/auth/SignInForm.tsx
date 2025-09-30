'use client'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/hooks/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Lock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormField } from './FormField'
import { SecurityVerification } from './SecurityVerification'
import { EmailVerification } from './EmailVerification'


export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setShowResendVerification(false)
    setUnconfirmedEmail(null)

    if (!turnstileToken) {
      toast({
        title: "Verification Required",
        description: "Please complete the security check",
      })
      setIsLoading(false)
      return
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: turnstileToken
        }
      })

      if (signInError) {
        // Check if the error is due to unconfirmed email
        if (signInError.message.includes('Email not confirmed')) {
          setUnconfirmedEmail(email)
          setShowResendVerification(true)
          toast({
            title: "Email Not Verified",
            description: "Please verify your email address before signing in. Check your spam folder if you don't see the verification email.",
          })
          setIsLoading(false)
          return
        }
        throw signInError
      }

      router.push('/app')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Sign In Failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:gap-4">
        <FormField
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
          disabled={isLoading}
          maxLength={40}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          icon={Mail}
        />
        
        <FormField
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          disabled={isLoading}
          maxLength={40}
          icon={Lock}
        />

        <SecurityVerification
          onTokenChange={setTurnstileToken}
          token={turnstileToken}
        />

        {showResendVerification && unconfirmedEmail && (
          <EmailVerification
            email={unconfirmedEmail}
            turnstileToken={turnstileToken}
          />
        )}

        <Button 
          type="submit"
          disabled={isLoading || !turnstileToken}
          className="bg-[#4B79E4] hover:bg-[#3D63C9] text-white"
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In
        </Button>
      </div>
    </form>
  )
}
