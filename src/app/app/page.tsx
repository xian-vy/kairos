'use client'

import { useBossStore } from '@/lib/stores/bossStore'

export default function AppPage() {
  const { bosses, respawnTimers, addBoss, deleteBoss, addRespawnTimer, deleteRespawnTimer, importGamePreset } = useBossStore()
  

  return (
    <div className="min-h-screen bg-[#0A0C1B] text-white">
     
    </div>
  )
} 