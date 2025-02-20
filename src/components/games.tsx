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
    <div className="mt-10 mb-24 sm:mt-14 lg:mt-16">
      <div className="relative  mb-10 md:mb-12 lg:mb-14 ">
          <h2 className="text-center  text-4xl md:text-5xl xl:text-6xl 3xl:text-7xl tracking-widest font-light font-space-grotesk text-gray-500">GAMES</h2>
          <div className="absolute inset-x-0 bottom-0 h-10 sm:h-10 lg:h-14 bg-gradient-to-t from-[#0A0C1B] to-transparent rounded-b-xl" />
      </div>
        <div className=" grid grid-cols-4  gap-0 sm:gap-5 lg:gap-10 max-w-[400px] md:max-w-[650px] lg:max-w-[700px] 2xl:max-w-screen-md mx-auto ">
            {games.map((game, index) => (
              <div key={index} className='relative w-[90px] h-[32px] md:w-[150px] md:h-[50px] 2xl:w-[175px] 2xl:h-[70px]'>
                <Image src={game.image} alt={game.name}   sizes="300px"
                fill
                style={{
                  objectFit: 'contain',
                }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-10 sm:h-16 lg:h-28 bg-gradient-to-t from-[#0A0C1B] to-transparent rounded-b-xl" />
              </div>
            ))}
        </div>
  </div>
  )
}

export default Games
