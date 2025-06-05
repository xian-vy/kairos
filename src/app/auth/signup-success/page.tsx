'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SignUpSuccess() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center w-full mx-auto">
      <div className="mx-auto flex flex-col justify-center space-y-6 w-full max-w-[380px] px-4">
        <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-emerald-500" />
            </div>
            <CardTitle className="text-xl font-bold text-[#E2E4FF]">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-[#B4B7E5] text-[0.8rem]">
              We&apos;ve sent a confirmation link to{' '}
              <span className="text-[#E2E4FF] font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-[#B4B7E5] space-y-2">
              <p>To complete your registration:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open your email inbox</li>
                <li>Look for an email from us</li>
                <li>Click the confirmation link in the email</li>
                <li>If you don&apos;t see the email, check your spam folder</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              asChild
              variant="ghost"
              className="w-full text-xs text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
            >
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 