'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BossList } from "./BossList"
import { BossTimerList } from "./BossTimerList"
import { FaSkull } from "react-icons/fa"
import { Timer } from "lucide-react"


export function BossPage() {
  return (
    <Tabs defaultValue="bosses" className="w-full">
      <TabsList className="flex justify-center mt-2 xl:mt-5">
        <TabsTrigger value="bosses" className="flex items-center gap-2">
            <FaSkull className="h-4 w-4 fill-red-800" /> Boss List
        </TabsTrigger>
        <TabsTrigger value="timers" className="flex items-center gap-2">
            <Timer className="h-4 w-4" /> Active Timers
        </TabsTrigger>
      </TabsList>
      <TabsContent value="timers" className="mt-4">
        <BossTimerList />
      </TabsContent>
      <TabsContent value="bosses" className="mt-4">
        <BossList />
      </TabsContent>
    </Tabs>
  )
} 