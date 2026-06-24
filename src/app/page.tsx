import { Hero } from "@/components/hero";
import { HomeStats } from "@/components/home/home-stats";
import { BehindScenes } from "@/components/home/behind-scenes";
import { VideoReel } from "@/components/home/video-reel";
import { HomeServices } from "@/components/home/home-services";
import { Testimonials } from "@/components/home/testimonials";
import { HomeCTA } from "@/components/home/home-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeStats />
      <BehindScenes />
      <VideoReel />
      <HomeServices />
      <Testimonials />
      <HomeCTA />
    </>
  );
}
