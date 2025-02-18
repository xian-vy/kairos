import React from 'react'
import Image from 'next/image'

const games = [
  {
    name: "MirM",
    image: "/games/mirm.png",
  },
  {
    name: "Diablo 4",
    image: "/games/diablov2.png",
  },
  {
    name: "Mir5",
    image: "/games/mir5v2.png",
  },
  {
    name: "Night Crows",
    image: "/games/nightcrows.png",
  },
  
]

const Games = () => {
  return (
    <div className=" grid grid-cols-4  gap-0 sm:gap-5 md:gap-8 max-w-[400px]   md:max-w-[500px] xl:max-w-[700px] 2xl:max-w-screen-md mx-auto my-10 sm:my-16 lg:my-20">
    {games.map((game, index) => (
      <div key={index} className='relative w-[100px] h-[30px] xl:w-[150px] xl:h-[50px] 2xl:w-[180px] 2xl:h-[70px]'>
        <Image src={game.image} alt={game.name}   sizes="300px"
        fill
        style={{
          objectFit: 'contain',
        }}
        />
        <div className="absolute inset-0 rounded-lg  mix-blend-overlay z-40"></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-12 lg:h-20 bg-gradient-to-t from-[#0A0C1B] to-transparent rounded-b-xl" />
      </div>
    ))}
  </div>

  )
}

export default Games
