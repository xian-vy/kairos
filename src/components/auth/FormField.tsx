'use client'
import { Input } from '@/components/ui/input'
import { LucideIcon } from 'lucide-react'

interface FormFieldProps {
  id: string
  type: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  maxLength?: number
  autoCapitalize?: 'none' | 'on'
  autoComplete?: string
  autoCorrect?: 'off'
  icon: LucideIcon
}

export function FormField({
  id,
  type,
  placeholder,
  value,
  onChange,
  disabled = false,
  maxLength,
  autoCapitalize,
  autoComplete,
  autoCorrect,
  icon: Icon
}: FormFieldProps) {
  return (
    <div className="grid gap-2 relative">
      <Icon className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B4B7E5] text-sm' />
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        className="border-[#1F2137] bg-[#0D0F23] text-[#E2E4FF] placeholder:text-[#B4B7E5]/50 pl-10"
      />
    </div>
  )
}
