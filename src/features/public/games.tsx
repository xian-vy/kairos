import React from 'react'
import Image from 'next/image'

const games = [
  {
    name: "MirM",
    image: "/games/mirm.png",
    description: "Elden Ring is a new action RPG from FromSoftware. It features a vast open world, deep combat mechanics, and a story that unfolds through exploration and dialogue.",
  },
  {
    name: "Diablo 4",
    image: "/games/diablo4.png",
    description: "Dark Souls 3 is a new action RPG from FromSoftware. It features a vast open world, deep combat mechanics, and a story that unfolds through exploration and dialogue.",
  },
  {
    name: "Night Crows",
    image: "/games/nc.webp",
    description: "Elden Ring is a new action RPG from FromSoftware. It features a vast open world, deep combat mechanics, and a story that unfolds through exploration and dialogue.",
  },
]

const Games = () => {
  return (
    <div className=" grid grid-cols-3  gap-8 max-w-screen-sm mx-auto">
    {games.map((game, index) => (
      <div key={index} className='relative'>
        <Image src={game.image} alt={game.name} width={200} height={155}     sizes="100vw"
            style={{
            width: '100%',
            height: 'auto',
            }} 
             className='rounded-lg '
        />
        <div className="absolute inset-0 rounded-lg bg-[#333333] mix-blend-overlay z-40"></div>

      </div>
    ))}
  </div>

  )
}

export default Games
