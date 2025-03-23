import React from 'react'
import Image from 'next/image'

const games = [
  {
    name: "MirM",
    image: "/games/mirm.png",
    players: "150k+ Players",
  },
  {
    name: "Diablo 4",
    image: "/games/diablov2.png",
    players: "10M+ Players",
  },
  {
    name: "Mir5",
    image: "/games/mir5v2.png",
    players: "1M+ Players",
  },
  {
    name: "Night Crows",
    image: "/games/nightcrows.png",
    players: "260K+ Players",
  },
]

const Games = () => {
  return (
    <div className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-base sm:text-xl md:text-2xl font-space-grotesk font-bold mb-12 relative bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2E4FF] to-[#B4B7E5]">
          Supported Games
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {games.map((game, index) => (
            <div key={index} className="group relative bg-[#0D0F23]/30 rounded-xl p-6 transition-all hover:bg-[#0D0F23]/50">
              <div className="relative w-full h-[60px] md:h-[80px]">
                <Image 
                  src={game.image} 
                  alt={game.name}   
                  fill
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-[#E2E4FF] font-space-grotesk">{game.name}</p>
                <p className="text-[#B4B7E5]">{game.players}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
