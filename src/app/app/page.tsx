"use client";

import { BossPage } from "@/features/protected/boss";
import { GroupSelection } from "@/features/protected/group";

export default function AppPage() {
  return (
    <div className="min-h-screen p-5 bg-[#0A0C1B] text-white max-w-screen-xl mx-auto">
      <GroupSelection />
      <BossPage />
    </div>
  );
}
