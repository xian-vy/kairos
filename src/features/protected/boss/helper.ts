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