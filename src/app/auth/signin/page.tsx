'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Lock, Mail, ShieldCheck, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Turnstile from "react-turnstile";

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [showTurnstile, setShowTurnstile] = useState(false)
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number>(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const {toast} = useToast()

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

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token)
    setIsVerifying(false)
  }

  const handleVerifyClick = () => {
    setIsVerifying(true)
    setShowTurnstile(true)
  }

  const resetVerification = () => {
    setTurnstileToken(null)
    setShowTurnstile(false)
    setIsVerifying(false)
  }

  const handleResendVerification = async () => {
    if (!unconfirmedEmail) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: unconfirmedEmail,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
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
      if (mode === 'signin') {
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
      } else {
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

        try {
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
                setMode('signin')
                return
              }

              // Handle primary key violation
              if (insertError.message.includes('users_pkey')) {
                toast({
                  title: "Account Already Exists",
                  description: "An account with this email already exists. Please sign in instead.",
                })
                setMode('signin')
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
            setMode('signin')
            return
          }

          // Redirect to success page with email
          router.push(`/auth/signup-success?email=${encodeURIComponent(email)}`)
          return
        } catch (error) {
          console.error('Error:', error)
          toast({
            title: "Sign Up Failed",
            description: error instanceof Error ? error.message : 'An error occurred',
          })
        }
      }
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
    <div className="container flex min-h-[100dvh] flex-col items-center justify-center w-full mx-auto">
      <div className="mx-auto flex flex-col justify-center space-y-6 w-full max-w-[380px] px-4">
        <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
          <CardHeader className="space-y-0 text-center">
            <CardTitle className="text-base sm:text-lg font-bold text-[#E2E4FF]">
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
              <div className="grid gap-3 sm:gap-4">
                {rateLimitCountdown > 0 && (
                  <div className="p-3 bg-[#1F2137] rounded-lg text-center">
                    <p className="text-sm text-[#B4B7E5]">
                      Please wait <span className="text-[#E2E4FF] font-medium">{rateLimitCountdown}</span> seconds before trying again
                    </p>
                  </div>
                )}
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
                  <div className="text-xs text-emerald-400 text-center">
                    {message}
                  </div>
                )}
                {!turnstileToken ? (
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
                        setTurnstileToken(null)
                      }}
                      theme="dark"
                      refreshExpired="auto"
                    />
                  </div>
                )}

                {showResendVerification && (
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
                )}

                <Button 
                  type="submit"
                  disabled={isLoading || !turnstileToken}
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
                resetVerification()
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