"use client";

import { BossPage } from "@/features";
import { GroupSelection } from "@/features/group";
import { useUserGroup } from "@/hooks/useUserGroup";

export default function AppPage() {
  const userGroupData = useUserGroup();

  return (
    <div className="min-h-screen p-5 bg-[#0A0C1B] text-white max-w-screen-xl mx-auto">
      <GroupSelection {...userGroupData} />
      <BossPage {...userGroupData} />
    </div>
  );
}
