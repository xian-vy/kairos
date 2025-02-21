import React from 'react';

const testimonials = [
  {
    content: "Kairos has completely transformed how our guild manages boss spawns. It's a game-changer!",
    author: "Sarah K.",
    role: "Guild Leader, MirM"
  },
  {
    content: "The most reliable boss tracking tool I've ever used. Clean interface and super accurate timers.",
    author: "Michael R.",
    role: "Raid Leader, Diablo 4"
  },
  {
    content: "Finally, no more missed world bosses! This tool is essential for any serious MMORPG player.",
    author: "David L.",
    role: "Content Creator"
  }
];

const Testimonials = () => {
  return (
    <div className="py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl md:text-4xl font-space-grotesk font-bold text-[#E2E4FF] mb-12">
          Trusted by Gamers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#0D0F23]/50 backdrop-blur-sm p-6 rounded-xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#4B79E4]/5 to-transparent rounded-xl" />
              <p className="text-[#B4B7E5] mb-4 relative z-10">{testimonial.content}</p>
              <div className="relative z-10">
                <p className="text-[#E2E4FF] font-semibold">{testimonial.author}</p>
                <p className="text-sm text-[#B4B7E5]">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 