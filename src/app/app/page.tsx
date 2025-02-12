'use client'

import { BossList } from "@/features/protected/boss/BossList"

export default function AppPage() {
  return (
    <div className="min-h-screen p-5 bg-[#0A0C1B] text-white max-w-screen-xl mx-auto">
      <BossList />
    </div>
  )
} 