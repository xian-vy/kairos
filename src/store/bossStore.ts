import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Boss {
  id: string
  name: string
  locations: string[]
  respawnCount: number
  respawnInterval: number
  randomRespawnDelay: number
}

interface RespawnTimer {
  id: string
  bossId: string
  killLocation: string
  killTime: Date
  nextRespawnTime: Date
}

interface GamePreset {
  name: string
  bosses: Boss[]
}

interface BossStore {
  bosses: Boss[]
  respawnTimers: RespawnTimer[]
  addBoss: (boss: Omit<Boss, 'id'>) => void
  deleteBoss: (id: string) => void
  updateBoss: (id: string, boss: Partial<Boss>) => void
  addRespawnTimer: (timer: Omit<RespawnTimer, 'id' | 'nextRespawnTime'>) => void
  deleteRespawnTimer: (id: string) => void
  updateRespawnTimer: (id: string, timer: Partial<RespawnTimer>) => void
  importGamePreset: (preset: GamePreset) => void
}


export const useBossStore = create<BossStore>()(
  persist(
    (set) => ({
      bosses: [],
      respawnTimers: [],
      addBoss: (newBoss) =>
        set((state) => ({
          bosses: [...state.bosses, { ...newBoss, id: crypto.randomUUID() }]
        })),
      deleteBoss: (id) =>
        set((state) => ({
          bosses: state.bosses.filter((boss) => boss.id !== id),
          respawnTimers: state.respawnTimers.filter((timer) => timer.bossId !== id)
        })),
      updateBoss: (id, updatedBoss) =>
        set((state) => ({
          bosses: state.bosses.map((boss) =>
            boss.id === id ? { ...boss, ...updatedBoss } : boss
          )
        })),
      addRespawnTimer: (newTimer) => {
        const boss = useBossStore.getState().bosses.find(b => b.id === newTimer.bossId)
        if (!boss) return

        const nextRespawnTime = new Date(newTimer.killTime)
        nextRespawnTime.setHours(
          nextRespawnTime.getHours() + boss.respawnInterval + Math.random() * boss.randomRespawnDelay
        )

        set((state) => ({
          respawnTimers: [...state.respawnTimers, {
            ...newTimer,
            id: crypto.randomUUID(),
            nextRespawnTime
          }]
        }))
      },
      deleteRespawnTimer: (id) =>
        set((state) => ({
          respawnTimers: state.respawnTimers.filter((timer) => timer.id !== id)
        })),
      updateRespawnTimer: (id, updatedTimer) =>
        set((state) => ({
          respawnTimers: state.respawnTimers.map((timer) =>
            timer.id === id ? { ...timer, ...updatedTimer } : timer
          )
        })),
      importGamePreset: (preset) =>
        set(() => ({
          bosses: preset.bosses
        }))
    }),
    {
      name: 'boss-storage'
    }
  )
)

export { type Boss, type RespawnTimer, type GamePreset }
