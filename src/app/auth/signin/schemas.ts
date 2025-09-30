import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(40, 'Email must be less than 40 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(40, 'Password must be less than 40 characters'),
  captchaToken: z
    .string()
    .min(1, 'Security verification is required'),
})

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(40, 'Email must be less than 40 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(40, 'Password must be less than 40 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  captchaToken: z
    .string()
    .min(1, 'Security verification is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  captchaToken: z
    .string()
    .min(1, 'Security verification is required'),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>
