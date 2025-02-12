import { BOSSDATA_NIGHTCROWS } from "@/lib/data/presets"
import { SupabaseClient } from '@supabase/supabase-js'

export const createDateFromTimeString = (timeStr: string) => {
    const today = new Date()
    const [hours, minutes] = timeStr.split(':')
    today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
    return today
  }

  export const calculateNextSpawn = (timeStr: string, respawnInterval: number) => {
    const deathTime = createDateFromTimeString(timeStr)
    deathTime.setHours(deathTime.getHours() + respawnInterval)
    return deathTime.toISOString()
  }

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export function formatTimeRemaining(nextSpawn: string): string {
  const now = new Date()
  const spawnTime = new Date(nextSpawn)
  const diff = spawnTime.getTime() - now.getTime()
  
  if (diff <= 0) return 'Ready to spawn!'
  if (isNaN(diff)) return 'Invalid time'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

export function formatTimeLeft(
  timeOfDeath: string, 
  respawnInterval: number, 
  includeSeconds: boolean = false
): string {
  const now = new Date()
  const deathTime = new Date(timeOfDeath)
  
  if (isNaN(deathTime.getTime())) return 'Invalid time'
  
  const respawnMs = respawnInterval * 60 * 60 * 1000
  const nextSpawn = new Date(deathTime.getTime() + respawnMs)
  
  // If we're past the next spawn time, show elapsed time since respawn
  if (now.getTime() > nextSpawn.getTime()) {
    const elapsedMs = now.getTime() - nextSpawn.getTime()
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60))
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return `Respawned ${hours}h ${minutes}m ago`
  }
  
  const timeUntilSpawn = nextSpawn.getTime() - now.getTime()
  
  const hours = Math.floor(timeUntilSpawn / (1000 * 60 * 60))
  const minutes = Math.floor((timeUntilSpawn % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeUntilSpawn % (1000 * 60)) / 1000)
  
  return includeSeconds 
    ? `${hours}h ${minutes}m ${seconds}s`
    : `${hours}h ${minutes}m`
}

export const getPresetRespawnInterval = (bossName: string) => {
  const preset = BOSSDATA_NIGHTCROWS.find(
    boss => boss.name === bossName
  )
  return preset?.respawnInterval || 12 // fallback to 12 if not found
}

export const getTimerColor = (timeOfDeath: string, respawnInterval: number) => {
  const tenMinutes = 1000 * 60 * 10
  const thirtyMinutes = 1000 * 60 * 30
  const oneHour = 1000 * 60 * 60
  const now = new Date()
  const deathTime = new Date(timeOfDeath)
  
  // Convert respawnInterval from hours to milliseconds
  const respawnMs = respawnInterval * 60 * 60 * 1000
  
  // Calculate next spawn time
  const nextSpawn = new Date(deathTime.getTime() + respawnMs)
  
  // If the spawn time has passed, return green
  if (now.getTime() > nextSpawn.getTime()) {
    return 'fill-green-500 stroke-green-500'  // Already spawned
  }
  
  const timeUntilSpawn = nextSpawn.getTime() - now.getTime()

  if (timeUntilSpawn <= tenMinutes) {
    return 'fill-green-500 stroke-green-500'  // Less than 10 minutes until spawn
  } else if (timeUntilSpawn <= thirtyMinutes) {
    return 'fill-yellow-500 stroke-yellow-500'  // Less than 30 minutes until spawn
  } else if (timeUntilSpawn <= oneHour) {
    return 'fill-orange-500 stroke-orange-500'  // Less than 1 hour until spawn
  } else {
    return 'fill-red-500 stroke-red-500'  // More than 1 hour until spawn
  }
}

interface BossKillCount {
  currentKills: number;
  totalRequired: number;
}

export async function getBossKillCount(
  bossName: string, 
  supabase: SupabaseClient
): Promise<BossKillCount> {
  // Get the preset data for this boss
  const preset = BOSSDATA_NIGHTCROWS.find(boss => boss.name === bossName)
  const totalRequired = preset?.respawnCount || 1

  // Get today's date at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    const { data: kills, error } = await supabase
      .from('boss_timers')
      .select('*')
      .eq('boss_name', bossName)
      .gte('time_of_death', today.toISOString())
      .lt('time_of_death', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())

    if (error) throw error

    return {
      currentKills: kills?.length || 0,
      totalRequired
    }
  } catch (error) {
    console.error('Error fetching boss kills:', error)
    return {
      currentKills: 0,
      totalRequired
    }
  }
}

export function getKillCountColor(current: number, total: number): string {
  if (current >= total) {
    return 'text-green-500'
  }
  if (current > 0) {
    return 'text-yellow-500'
  }
  return 'text-[#B4B7E5]'
}

