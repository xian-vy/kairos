'use client'
import { AuthLayout } from './AuthLayout'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'
import { useState } from 'react'

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const handleToggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  const isSignIn = mode === 'signin'

  return (
    <AuthLayout
      title={isSignIn ? 'Sign in' : 'Create an account'}
      description={isSignIn 
        ? 'Enter your credentials to sign in'
        : 'Enter your details to create an account'
      }
      toggleText={isSignIn
        ? "Don't have an account? Sign up"
        : 'Already have an account? Sign in'
      }
      onToggle={handleToggleMode}
    >
      {isSignIn ? (
        <SignInForm />
      ) : (
        <SignUpForm onToggleMode={handleToggleMode} />
      )}
    </AuthLayout>
  )
}
