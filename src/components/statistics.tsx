import React from 'react';

const stats = [
  {
    number: "50K+",
    label: "Active Users"
  },
  {
    number: "100K+",
    label: "Boss Kills Tracked"
  },
  {
    number: "20+",
    label: "Supported Games"
  },
  {
    number: "99.9%",
    label: "Uptime"
  }
];

const Statistics = () => {
  return (
    <div className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                <div className="absolute -inset-2 blur-2xl bg-gradient-to-r from-[#4B79E4]/10 to-[#9D68E4]/10" />
                <p className="text-3xl md:text-4xl font-bold text-[#E2E4FF] relative">
                  {stat.number}
                </p>
              </div>
              <p className="text-[#B4B7E5] mt-2 font-space-grotesk">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics; 