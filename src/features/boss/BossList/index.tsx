"use client";

import { useBossDataStore } from "@/stores/bossDataStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Info, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BossTimerDialog } from "../BossTimer/BossTimerDialog";
import { refreshKillCounts } from "../helper";
import { BossListCard } from "./BossListCard";
import { BossListCardSkeleton } from "./BossListCardSkeleton";
import { BossTimer, BossData } from "@/types/database.types";
import useRealtimeTimers from "@/hooks/useRealtimeTimers";
import useRealtimeBossData from "@/hooks/useRealtimeBossData";
import { Button } from "@/components/ui/button";
import { BossDialog } from "./BossDialog";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useGroupStore } from "@/stores/groupStore";
import useScreenSize from "@/hooks/useScreensize";
import { Skeleton } from "@/components/ui/skeleton";
import MonetagOnclick from "@/app/MontetagOnclick";

export function BossList() {

  const [selectedBoss, setSelectedBoss] = useState<BossTimer | null>(null);
  const [selectedBossForEdit, setSelectedBossForEdit] = useState<BossData | undefined>();
  useRealtimeTimers();
  useRealtimeBossData();
  const [killCounts, setKillCounts] = useState<
    Record<
      string,
      {
        current: number;
        total: number;
      } | null
    >
  >({});
  const [showAddBossDialog, setShowAddBossDialog] = useState(false);
  const { currentUser } = useCurrentUser();
  const { group } = useGroupStore();
  const isAdmin = group?.created_by === currentUser?.id;
  const screenSize = useScreenSize();
  const supabase = createClientComponentClient();
  const { bossData, isLoading } = useBossDataStore();
  const updateKillCounts = async () => {
    const counts = await refreshKillCounts(bossData, supabase);
    setKillCounts(counts);
  };


  useEffect(() => {
    if (bossData.length > 0) {
      // Initialize all boss kill counts as null to show loading state
      const initialCounts = bossData.reduce((acc, boss) => {
        acc[boss.boss_name] = null;
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
        <div className="flex w-full justify-between items-center">
            <p className="text-[#B4B7E5] text-xs flex items-center gap-1.5 ">
              <Info className="h-4 w-4" /> Select kill location to create a timer for next spawn
            </p>
            <Skeleton className="w-[100px] h-7" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <BossListCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const handleSelectBoss = (name: string, selectedLocation: string) => {
    setSelectedBoss({
      user_id: "",
      created_at: new Date().toISOString(),
      boss_name: name,
      location: selectedLocation,
      time_of_death: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      notes: "",
    });
  };



  return (
    <>
    <MonetagOnclick />
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[#B4B7E5] text-xs flex items-center gap-1.5 ">
          <Info className="h-4 w-4" /> Select kill location to create a timer for next spawn
        </p>
        {isAdmin && (
          <Button
          size="sm"
            onClick={() => {setSelectedBossForEdit(undefined);setShowAddBossDialog(true);}}
            className="bg-[#1F2137] hover:bg-[#2A2D4B] text-[#E2E4FF] text-xs"
          >
            <Plus className="h-4 w-4" /> {screenSize === "desktop"  &&"Add Boss"}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bossData
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((boss) => (
            <BossListCard
              key={boss.id}
              boss={boss}
              killCount={killCounts[boss.boss_name]}
              onLocationSelect={handleSelectBoss}
            />
          ))}
      </div>

      <BossTimerDialog
        isOpen={!!selectedBoss}
        onClose={() => setSelectedBoss(null)}
        bossTimer={selectedBoss}
        onTimerCreated={() => {
          const event = new Event("bossTimerCreated");
          window.dispatchEvent(event);
          updateKillCounts();
          setSelectedBoss(null);
        }}
      />

      <BossDialog 
        isOpen={!!selectedBossForEdit || showAddBossDialog}
        onClose={() => {
          setSelectedBossForEdit(undefined);
          setShowAddBossDialog(false);
        }}
        bossData={selectedBossForEdit}
      />
    </div>
    </>
  );
}
