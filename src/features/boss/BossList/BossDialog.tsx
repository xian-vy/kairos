"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import { MAX_BOSS_COUNT, MAX_LOCATION_COUNT } from "@/lib/constants";
import { BOSS_NAMES_NIGHTCROWS } from "@/lib/data/presets";
import { useBossDataStore } from "@/stores/bossDataStore";
import { useGroupStore } from "@/stores/groupStore";
import { BossData } from "@/types/database.types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface BossDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bossData?: BossData;
}

export function BossDialog({ isOpen, onClose, bossData }: BossDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useCurrentUser();
  const { group } = useGroupStore();
  const isAdmin = group?.created_by === currentUser?.id;
  const { toast } = useToast();
  const isEditMode = !!bossData;
  const { bossData : currentBosses } = useBossDataStore();

  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [formData, setFormData] = useState<BossData>({
    id: crypto.randomUUID(),
    boss_name: "",
    sortOrder: 1,
    group_id: group?.id ?? "",
    data: {
      name: "",
      sortOrder:11,
      locations: [],
      respawnInterval: 4,
      respawnCount: 1,
      respawnIntervalDelay: 0
    }
  });

  useEffect(() => {
    if (bossData) {
      setFormData(bossData);
      setLocations(bossData.data.locations);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        boss_name: "",
        sortOrder: 1,
        group_id: group?.id ?? "",
        data: {
          name: "",
          sortOrder:11,
          locations: [],
          respawnInterval: 4,
          respawnCount: 1,
          respawnIntervalDelay: 0
        }
      });
      setLocations([]);
    }
  }, [bossData,group?.id]);

  const handleAddLocation = () => {
    if (newLocation.trim() !== "" && locations.length < MAX_LOCATION_COUNT) {
      const updatedLocations = [...locations, newLocation.trim()];
      setLocations(updatedLocations);
      setFormData({
        ...formData,
        data: {
          ...formData.data!,
          locations: updatedLocations
        }
      });
      setNewLocation("");
    } else if (locations.length >= MAX_LOCATION_COUNT) {
      toast({
        variant: "destructive",
        title: "Add Failed",
        description: `You can only add up to ${MAX_LOCATION_COUNT} locations`,
      });
    }
  };

  const handleRemoveLocation = (location: string) => {
    if (locations.length > 1) {
      const updatedLocations = locations.filter((loc) => loc !== location);
      setLocations(updatedLocations);
      setFormData({
        ...formData,
        data: {
          ...formData.data!,
          locations: updatedLocations
        }
      });
    } else {
      toast({
        variant: "destructive",
        title: "Remove Failed",
        description: "At least one location must remain",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!isAdmin) throw new Error("Only Admin can modify boss data.");
      if (!formData.boss_name || locations.length === 0) {
        throw new Error("Boss name and at least one location are required.");
      }
     if (currentBosses.length >= MAX_BOSS_COUNT) { 
        throw new Error(`You can only add up to ${MAX_BOSS_COUNT} bosses`);
      }
      if (isEditMode) {
        console.log("formData",formData)
        await useBossDataStore.getState().updateBossData(formData as BossData);
        toast({
          variant: "success",
          title: "Success",
          description: "Boss updated successfully",
        });
      } else {
        await useBossDataStore.getState().addBossData(formData as BossData);
        toast({
          variant: "success",
          title: "Success",
          description: "Boss added successfully",
        });
      }

      onClose();
    } catch (error) {
      console.error("Error modifying boss data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to modify boss data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0C1B] border-gray-800 w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {isEditMode ? `Edit ${bossData.boss_name}` : 'Add New Boss'}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info">
          <TabsList className="flex gap-2  justify-center">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <div className="space-y-1 pt-2">
              <div className="space-y-2">
                <label className=" text-[#B4B7E5]">Boss Name</label>
                <Input
                  type="text"
                  value={formData.boss_name}
                  onChange={(e) => setFormData({ ...formData, boss_name: e.target.value as BOSS_NAMES_NIGHTCROWS })}
                  className="bg-black/20 border-gray-800 text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className=" text-[#B4B7E5]">Sort Order</label>
                      <Input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                        className="bg-black/20 border-gray-800 text-white"
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className=" text-[#B4B7E5]">Respawn Interval (hrs)</label>
                      <Input
                        type="number"
                        value={formData.data.respawnInterval}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          data: {
                            ...formData.data,
                            respawnInterval: Number(e.target.value)
                          }
                        })}
                        className="bg-black/20 border-gray-800 text-white"
                      />
                    </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className=" text-[#B4B7E5]">Respawn Count</label>
                      <Input
                        type="number"
                        value={formData.data.respawnCount}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          data: {
                            ...formData.data,
                            respawnCount: Number(e.target.value)
                          }
                        })}
                        className="bg-black/20 border-gray-800 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className=" text-[#B4B7E5]">Interval Delay (hrs)</label>
                      <Input
                        type="number"
                        value={formData.data.respawnIntervalDelay}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          data: {
                            ...formData.data,
                            respawnIntervalDelay: Number(e.target.value)
                          }
                        })}
                        className="bg-black/20 border-gray-800 text-white"
                      />
                    </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="locations">
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-2">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Enter New Location"
                  className="border-[#1F2137] bg-black/20 text-[#E2E4FF] placeholder:text-[#B4B7E5]/50 text-xs sm:text-sm"

                />
                <Button onClick={handleAddLocation} className="bg-[#1F2137] ">Add</Button>
              </div>
              <div className="space-y-3">
                {locations.map((location) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-[#B4B7E5]">{location}</span>
                    <X  onClick={() => handleRemoveLocation(location)} className="h-4 w-4 text-[#B4B7E5] cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-2">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || !isAdmin}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                isEditMode ? "Save Changes" : "Add Boss"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 