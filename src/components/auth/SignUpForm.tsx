'use client'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/hooks/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Lock, Mail, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FormField } from './FormField'
import { SecurityVerification } from './SecurityVerification'

interface SignUpFormProps {
  onToggleMode: () => void
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number>(0)
  
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  // Add useEffect for countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (rateLimitCountdown > 0) {
      timer = setInterval(() => {
        setRateLimitCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [rateLimitCountdown])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const validateUsername = (username: string) => {
    if (username.length < 3) {
      return 'Username must be at least 3 characters long'
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    if (!turnstileToken) {
      toast({
        title: "Verification Required",
        description: "Please complete the security check",
      })
      setIsLoading(false)
      return
    }

    try {
      const usernameError = validateUsername(username)
      if (usernameError) {
        toast({
          title: "Sign Up Failed",
          description: usernameError,
        })
        setIsLoading(false)
        return
      }

      const passwordError = validatePassword(password)
      if (passwordError) {
        toast({
          title: "Sign Up Failed",
          description: passwordError,
        })
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        toast({
          title: "Sign Up Failed",
          description: 'Passwords do not match',
        })
        setIsLoading(false)
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          captchaToken: turnstileToken,
          data: {
            username,
            email_confirmed: false,
          },
        },
      })
      
      if (signUpError) {
        // Handle rate limiting error
        if (signUpError.message.includes('For security purposes, you can only request this after')) {
          setRateLimitCountdown(10)
          toast({
            title: "Too Many Requests",
            description: "Please wait 10 seconds before trying again.",
          })
          setIsLoading(false)
          return
        }
        throw signUpError
      }

      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              username,
              status: 'pending',
              email: email,
            }
          ])

        if (insertError) {
          console.error('Database error:', insertError)
          
          // Handle duplicate username error
          if (insertError.message.includes('users_username_key')) {
            toast({
              title: "Username Already Taken",
              description: "This username is already in use. Please choose a different username.",
            })
            return
          }

          // Handle duplicate email error
          if (insertError.message.includes('users_email_key')) {
            toast({
              title: "Email Already Registered",
              description: "This email is already registered. Please sign in instead.",
            })
            onToggleMode()
            return
          }

          // Handle primary key violation
          if (insertError.message.includes('users_pkey')) {
            toast({
              title: "Account Already Exists",
              description: "An account with this email already exists. Please sign in instead.",
            })
            onToggleMode()
            return
          }

          toast({
            title: "Account Creation Incomplete",
            description: "Your account was created but there was an error setting up your profile. Please contact support.",
          })
          return
        }
      }

      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Account Already Exists",
          description: "An account with this email already exists. Please sign in instead.",
        })
        onToggleMode()
        return
      }

      // Redirect to success page
      router.push(`/auth/signup-success`)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:gap-4">
        {rateLimitCountdown > 0 && (
          <div className="p-3 bg-[#1F2137] rounded-lg text-center">
            <p className="text-sm text-[#B4B7E5]">
              Please wait <span className="text-[#E2E4FF] font-medium">{rateLimitCountdown}</span> seconds before trying again
            </p>
          </div>
        )}

        <FormField
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={setUsername}
          disabled={isLoading}
          maxLength={20}
          icon={User}
        />

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

        <FormField
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          disabled={isLoading}
          maxLength={40}
          icon={Lock}
        />

        <SecurityVerification
          onTokenChange={setTurnstileToken}
          token={turnstileToken}
        />

        <Button 
          type="submit"
          disabled={isLoading || !turnstileToken}
          className="bg-[#4B79E4] hover:bg-[#3D63C9] text-white"
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign Up
        </Button>
      </div>
    </form>
  )
}
