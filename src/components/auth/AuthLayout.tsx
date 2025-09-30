'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  toggleText: string
  onToggle: () => void
  isToggleDisabled?: boolean
}

export function AuthLayout({ 
  title, 
  description, 
  children, 
  toggleText, 
  onToggle, 
  isToggleDisabled = false 
}: AuthLayoutProps) {
  return (
    <div className="container flex min-h-[100dvh] flex-col items-center justify-center w-full mx-auto">
      <div className="mx-auto flex flex-col justify-center space-y-6 w-full max-w-[380px] px-4">
        <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
          <CardHeader className="space-y-0 text-center">
            <CardTitle className="text-base sm:text-lg font-bold text-[#E2E4FF]">
              {title}
            </CardTitle>
            <CardDescription className="text-[#B4B7E5] text-[0.8rem]">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full text-xs text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
              onClick={onToggle}
              disabled={isToggleDisabled}
            >
              {toggleText}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
