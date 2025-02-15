"use client";

import { useBossDataStore } from "@/stores/bossDataStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { BossTimerDialog } from "../BossTimer/BossTimerDialog";
import { refreshKillCounts } from "../helper";
import { BossListCard } from "./BossListCard";
import { BossListCardSkeleton } from "./BossListCardSkeleton";

export function BossList() {

  const [selectedBoss, setSelectedBoss] = useState<{
    name: string;
    respawnInterval: number;
    locations: string[];
    selectedLocation?: string;
  } | null>(null);

  const [killCounts, setKillCounts] = useState<
    Record<
      string,
      {
        current: number;
        total: number;
      } | null
    >
  >({});

  const supabase = createClientComponentClient();
  const { bossData, isLoading, refreshBossData } = useBossDataStore();

  const updateKillCounts = async () => {
    const counts = await refreshKillCounts(bossData, supabase);
    setKillCounts(counts);
  };


  useEffect(() => {
    if (bossData.length > 0) {
      // Initialize all boss kill counts as null to show loading state
      const initialCounts = bossData.reduce((acc, boss) => {
        acc[boss.name] = null;
        return acc;
      }, {} as Record<string, { current: number; total: number } | null>);
      
      setKillCounts(initialCounts);
      updateKillCounts();
    }
  }, [bossData]);

  useEffect(() => {
    window.addEventListener("bossTimerCreated", updateKillCounts);
    return () => {
      window.removeEventListener("bossTimerCreated", updateKillCounts);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <p className="text-[#B4B7E5] text-xs flex items-center gap-1.5 ">
          <Info className="h-4 w-4" /> Select kill location to create a timer for next spawn
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <BossListCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }



  return (
    <div className="p-4 space-y-6">
      <p className="text-[#B4B7E5] text-xs flex items-center gap-1.5 ">
        <Info className="h-4 w-4" /> Select kill location to create a timer for next spawn
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bossData
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((boss) => (
            <BossListCard
              key={boss.name}
              boss={boss}
              killCount={killCounts[boss.name]}
              //onBossSelect={(name, respawnInterval, locations) => setSelectedBoss({ name, respawnInterval, locations })}
              onLocationSelect={(name, respawnInterval, locations, selectedLocation) =>
                setSelectedBoss({ name, respawnInterval, locations, selectedLocation })
              }
              onBossUpdated={refreshBossData}
            />
          ))}
      </div>

      <BossTimerDialog
        isOpen={!!selectedBoss}
        onClose={() => setSelectedBoss(null)}
        bossName={selectedBoss?.name ?? ""}
        locations={selectedBoss?.locations ?? []}
        selectedLocation={selectedBoss?.selectedLocation}
        onTimerCreated={() => {
          const event = new Event("bossTimerCreated");
          window.dispatchEvent(event);
          updateKillCounts();
          setSelectedBoss(null);
        }}
      />
    </div>
  );
}
