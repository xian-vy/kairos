import { BOSSDATA_NIGHTCROWS } from "@/lib/data/presets"

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

export function formatTimeLeft(timeOfDeath: string, respawnInterval: number): string | null {
  const now = new Date()
  const deathTime = new Date(timeOfDeath)
  
  if (isNaN(deathTime.getTime())) return 'Invalid time'
  
  // Convert hours to milliseconds (respawnInterval is in hours)
  const respawnMs = respawnInterval * 60 * 60 * 1000 // Convert hours to milliseconds
  const nextSpawn = new Date(deathTime.getTime() + respawnMs)
  
  // If the death time is in the future (which shouldn't happen), return the full interval
  if (deathTime.getTime() > now.getTime()) {
    return `${respawnInterval}h 0m`
  }
  
  // If the next spawn time is in the past, calculate the next future spawn
  while (nextSpawn.getTime() <= now.getTime()) {
    nextSpawn.setTime(nextSpawn.getTime() + respawnMs)
  }
  
  const timeUntilSpawn = nextSpawn.getTime() - now.getTime()
  
  if (timeUntilSpawn <= 0) return null
  
  const hours = Math.floor(timeUntilSpawn / (1000 * 60 * 60))
  const minutes = Math.floor((timeUntilSpawn % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
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
  
  // If the next spawn time is in the past, calculate the next future spawn
  while (nextSpawn.getTime() <= now.getTime()) {
    nextSpawn.setTime(nextSpawn.getTime() + respawnMs)
  }
  
  const timeUntilSpawn = nextSpawn.getTime() - now.getTime()

  if (timeUntilSpawn <= tenMinutes) {
    return 'fill-green-500 stroke-green-500'  // Less than 10 minutes until spawn
  } else if (timeUntilSpawn <= thirtyMinutes) {
    return 'fill-yellow-500 stroke-yellow-500'  // Less than 30 minutes until spawn
  } else if (timeUntilSpawn <= oneHour) {
    return 'fill-orange-500 stroke-orange-500'  // Less than 1 hour until spawn
  } else {
    return 'fill-red-500 stroke-red-500'  // More than 30 minutes until spawn
  }
}

