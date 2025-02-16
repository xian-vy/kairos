"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Import Tabs components
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { BOSSDATA_TYPE } from "@/lib/data/presets";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useGroupStore } from "@/stores/groupStore";
import { X } from "lucide-react";

interface EditBossDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bossData: BOSSDATA_TYPE;
  onBossUpdated: () => void;
}

export function EditBossDialog({ isOpen, onClose, bossData, onBossUpdated }: EditBossDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    respawnInterval: bossData.respawnInterval,
    respawnCount: bossData.respawnCount,
    respawnIntervalDelay: bossData.respawnIntervalDelay,
    sortOrder: bossData.sortOrder,
  });
  const { currentUser } = useCurrentUser();
  const { group } = useGroupStore();
  const isAdmin = group?.created_by === currentUser?.id;
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  const [locations, setLocations] = useState(bossData.locations);
  const [newLocation, setNewLocation] = useState("");

  const handleAddLocation = () => {
    if (newLocation.trim() !== "" && locations.length < 15) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation("");
    } else if (locations.length >= 15) {
      toast({
        variant: "destructive",
        title: "Add Failed",
        description: "You can only add up to 15 locations",
      });
    }
  };

  const handleRemoveLocation = (location: string) => {
    if (locations.length > 1) {
      setLocations(locations.filter((loc) => loc !== location));
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
      if (!isAdmin) throw new Error("Only Admin can update boss data.");
      if (!currentUser) throw new Error("No user found");

      const { data: userGroup } = await supabase.from("users").select("group_id").eq("id", currentUser.id).single();

      if (!userGroup?.group_id) throw new Error("No group found");

      // Update the boss data
      const updatedBossData: BOSSDATA_TYPE = {
        ...bossData,
        ...formData,
        locations, 
      };

      const { error: updateError } = await supabase
        .from("boss_data")
        .update({ data: updatedBossData })
        .eq("group_id", userGroup.group_id)
        .eq("boss_name", bossData.name);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Boss data updated successfully",
      });

      onBossUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating boss data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update boss data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0C1B] border-gray-800 w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Edit {bossData.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info">
          <TabsList className="flex gap-2  justify-center">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <div className="space-y-1 pt-2">
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
                <label className=" text-[#B4B7E5]">Respawn Interval (hours)</label>
                <Input
                  type="number"
                  value={formData.respawnInterval}
                  onChange={(e) => setFormData({ ...formData, respawnInterval: Number(e.target.value) })}
                  className="bg-black/20 border-gray-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className=" text-[#B4B7E5]">Respawn Count</label>
                <Input
                  type="number"
                  value={formData.respawnCount}
                  onChange={(e) => setFormData({ ...formData, respawnCount: Number(e.target.value) })}
                  className="bg-black/20 border-gray-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className=" text-[#B4B7E5]">Respawn Interval Delay (hours)</label>
                <Input
                  type="number"
                  value={formData.respawnIntervalDelay}
                  onChange={(e) => setFormData({ ...formData, respawnIntervalDelay: Number(e.target.value) })}
                  className="bg-black/20 border-gray-800 text-white"
                />
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
                  className="border-[#1F2137] bg-[#0D0F23] text-[#E2E4FF] placeholder:text-[#B4B7E5]/50 text-xs sm:text-sm"

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
        <DialogFooter>
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
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
