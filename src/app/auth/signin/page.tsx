'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()
  const supabase = createClientComponentClient()

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError

        router.push('/')
        router.refresh()
      } else {
        // Validate password for sign up
        const passwordError = validatePassword(password)
        if (passwordError) {
          setError(passwordError)
          setIsLoading(false)
          return
        }

        // Check if passwords match
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setIsLoading(false)
          return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              email_confirmed: false,
            },
          },
        })
        
        if (signUpError) {
          console.error('Signup error:', signUpError)
          setError(signUpError.message)
          return
        }

        // Check if the response indicates user already exists
        if (data?.user?.identities?.length === 0) {
          setError('An account with this email already exists. Please sign in instead.')
          return
        }

        setMessage(
          'Success! Please check your email for the confirmation link to complete your registration. If you don\'t see it, check your spam folder.'
        )
        // Clear form
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        
        // Don't redirect yet - wait for email confirmation
        return
      }
    } catch (error) {
      console.error('Error:', error) // For debugging
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center w-full mx-auto">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-[#E2E4FF]">
              {mode === 'signin' ? 'Sign in' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-[#B4B7E5]">
              {mode === 'signin'
                ? 'Enter your credentials to sign in'
                : 'Enter your details to create an account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[#E2E4FF]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#1F2137] bg-[#0D0F23] text-[#E2E4FF] placeholder:text-[#B4B7E5]/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-[#E2E4FF]">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#1F2137] bg-[#0D0F23] text-[#E2E4FF]"
                  />
                </div>
                {mode === 'signup' && (
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-[#E2E4FF]">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      disabled={isLoading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-[#1F2137] bg-[#0D0F23] text-[#E2E4FF]"
                    />
                  </div>
                )}
                {error && (
                  <div className="text-sm text-red-400">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="text-sm text-emerald-400">
                    {message}
                  </div>
                )}
                <Button 
                  disabled={isLoading}
                  className="bg-[#4B79E4] hover:bg-[#3D63C9] text-white"
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full text-xs text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError(null)
                setMessage(null)
                setEmail('')
                setPassword('')
                setConfirmPassword('')
              }}
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 