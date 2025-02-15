"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Pencil } from "lucide-react";
import { FaSkull } from "react-icons/fa";
import { getKillCountColor } from "../helper";
import { useState } from "react";
import { EditBossDialog } from "./EditBossDialog";
import { BOSSDATA_TYPE } from "@/lib/data/presets";

interface BossListCardProps {
  boss: BOSSDATA_TYPE;
  killCount?: {
    current: number;
    total: number;
  } | null;
  //onBossSelect: (name: string, respawnInterval: number, locations: string[]) => void;
  onLocationSelect: (name: string, respawnInterval: number, locations: string[], selectedLocation: string) => void;
  onBossUpdated: () => void;
}

export function BossListCard({ boss, killCount, onLocationSelect, onBossUpdated }: BossListCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const KillCountDisplay = () => {
    if (killCount === null) {
      return (
        <div className="h-4 w-8 bg-[#1F2137] animate-pulse rounded" />
      );
    }

    return (
      <span className={`text-xs ${getKillCountColor(
        killCount?.current || 0,
        killCount?.total || boss.respawnCount
      )}`}>
        ({killCount?.current || 0}/{killCount?.total || boss.respawnCount})
      </span>
    );
  };

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm cursor-pointer"
      // onClick={() => onBossSelect(boss.name, boss.respawnInterval, boss.locations)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-[#E2E4FF]">
          <span className="group-hover:text-[#4B79E4] transition-colors text-base flex items-center gap-2">
            <FaSkull className="h-4 w-4 fill-red-800" />
            <div className="flex items-center gap-2">
              {boss.name}
              <KillCountDisplay />
            </div>
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#1F2137] text-[#B4B7E5]">
              {boss.respawnInterval}h
            </Badge>
            <div
              className="bg-[#1F2137] hover:bg-[#2A2D4B] p-1 rounded cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowEditDialog(true);
              }}
            >
              <Pencil className="h-4 w-4 text-[#B4B7E5] p-0.5" />
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-xs text-[#B4B7E5]">
          Spawns <span className="font-extrabold">{boss.respawnCount}x</span> every{" "}
          <span className="font-extrabold">
            {boss.respawnInterval} {boss.respawnInterval === 1 ? "hour" : "hours"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[120px] w-full rounded-md pr-4">
          <div className="space-y-2.5">
            {boss.locations.map((location) => (
              <div
                key={location}
                className="flex hover:underline items-center gap-2 text-sm text-[#B4B7E5] group-hover:text-[#E2E4FF] transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onLocationSelect(boss.name, boss.respawnInterval, boss.locations, location);
                }}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">{location}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <EditBossDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        bossData={boss}
        onBossUpdated={onBossUpdated}
      />
    </Card>
  );
}
