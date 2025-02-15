import { FaBell, FaClock, FaCog, FaUsers } from "react-icons/fa";

export const features = [
    {
      icon: <FaClock className="h-4 w-4 xl:w-5 xl:h-5  3xl:h-6 3xl:w-6 text-[#4B79E4]" />,
      title: "Universal Tracking",
      description: "Track boss spawns and timers across any MMORPG with our flexible tracking system.",
    },
    {
      icon: <FaBell className="h-4 w-4 xl:w-5 xl:h-5 3xl:h-6 3xl:w-6 text-[#9D68E4]" />,
      title: "Real-time Updates",
      description: "Get instant notifications and updates for your tracked bosses.",
    },
    {
      icon: <FaUsers className="h-4 w-4 xl:w-5 xl:h-5 3xl:h-6 3xl:w-6 text-[#E45A68]" />,
      title: "Community Driven",
      description: "Contribute to the community by adding new bosses and presets to the database.",
    },
    {
      icon: <FaCog className="h-4 w-4 xl:w-5 xl:h-5 3xl:h-6 3xl:w-6 text-[#E2E4FF]" />,
      title: "Presets",
      description: "Select custom available presets for existing games to enhance your experience.",
    },
  ];
  