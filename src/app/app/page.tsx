import { Features } from "@/features";
import { GroupSelection } from "@/features/group";
export default function AppPage() {
  return (
    <div className="min-h-screen p-5 bg-[#0A0C1B] text-white max-w-screen-xl mx-auto">
      <GroupSelection  />
      <Features />
    </div>
  );
}
