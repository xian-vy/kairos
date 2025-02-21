import Features from "@/components/features";
import Games from "@/components/games";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="bg-[#0A0C1B]">
      <Hero />
      {/* <Statistics /> */}
      <Games />
      <Features />
      {/* <Testimonials /> */}
    </main>
  );
}
