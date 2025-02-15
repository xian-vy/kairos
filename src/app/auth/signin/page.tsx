'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Lock, Mail, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()
  const supabase = createClientComponentClient()
  const {toast} = useToast()

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
    setMessage(null)

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError

        router.push('/app')
        router.refresh()
      } else {
        // Validate username for sign up
        const usernameError = validateUsername(username)
        if (usernameError) {
          toast({
            title: "Sign Up Failed",
            description: usernameError,
          })
          setIsLoading(false)
          return
        }

        // Validate password for sign up
        const passwordError = validatePassword(password)
        if (passwordError) {
          toast({
            title: "Sign Up Failed",
            description: passwordError,
          })
          setIsLoading(false)
          return
        }

        // Check if passwords match
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
            data: {
              username,
              email_confirmed: false,
            },
          },
        })
        
        if (signUpError) throw signUpError

        // Insert into users table
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

          if (insertError) throw insertError
        }

        // Check if the response indicates user already exists
        if (data?.user?.identities?.length === 0) {
          toast({
            title: "Sign In Failed",
            description: 'An account with this email already exists. Please sign in instead.',
          })
          return
        }

        setMessage(
          'Success! Please check your email for the confirmation link to complete your registration. If you don\'t see it, check your spam folder.'
        )
        // Clear form
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setUsername('')
        
        // Don't redirect yet - wait for email confirmation
        return
      }
    } catch (error) {
      console.error('Error:', error) // For debugging
      toast({
        title: "Sign In Failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center w-full mx-auto">
      <div className="mx-auto flex flex-col justify-center space-y-6 w-11/12 sm:w-[360px] px-4">
        <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-xl font-bold text-[#E2E4FF]">
              {mode === 'signin' ? 'Sign in' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-[#B4B7E5] text-[0.8rem]">
              {mode === 'signin'
                ? 'Enter your credentials to sign in'
                : 'Enter your details to create an account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {mode === 'signup' && (
                  <div className="grid gap-2 relative">
                    <User className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B4B7E5] text-sm' />
                    <Input
                      maxLength={20}
                      id="username"
                      placeholder="Username"
                      type="text"
                      disabled={isLoading}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-[#1F2137] bg-[#0D0F23] text-[#E2E4FF] placeholder:text-[#B4B7E5]/50 pl-10"
                    />
                  </div>
                )}
                <div className="grid gap-2 relative">
                < Mail className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B4B7E5] text-sm' />
                  <Input
                    maxLength={40}
                    id="email"
                    placeholder="Email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#1F2137] bg-[#0D0F23] text-[#E2E4FF] placeholder:text-[#B4B7E5]/50 pl-10"
                  />
                </div>
                <div className="grid gap-2 relative">
                 <Lock className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B4B7E5] text-sm' />
                  <Input
                    maxLength={40}
                    id="password"
                    type="password"
                    disabled={isLoading}
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#1F2137] bg-[#0D0F23] text-[#E2E4FF] placeholder:text-[#B4B7E5]/50 pl-10"
                  />
                </div>
                {mode === 'signup' && (
                  <div className="grid gap-2 relative">
                    <Lock className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B4B7E5] text-sm' />
                    <Input
                      maxLength={40}
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      type="password"
                      disabled={isLoading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-[#1F2137] bg-[#0D0F23] text-[#E2E4FF] placeholder:text-[#B4B7E5]/50 pl-10"
                    />
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
                setMessage(null)
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setUsername('')
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