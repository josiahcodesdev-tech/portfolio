import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-navy">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/90" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-gold font-medium text-sm tracking-widest uppercase mb-4">
          Professional Consultant
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.1] mb-6">
          Empowering Your Success
          <br />
          <span className="text-gold">Through Expert Consulting</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
          Professional consulting services tailored to help businesses, job
          seekers, and organizations achieve their goals with precision and
          excellence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <Button className="bg-gold text-navy font-bold hover:bg-gold-hover hover:shadow-xl rounded-full px-8 py-6 text-base cursor-pointer transition-all">
              Book a Free Consultation
            </Button>
          </Link>
          <Link href="/services">
            <Button
              variant="outline"
              className="border-2 border-white/30 text-white bg-white/10 hover:bg-white hover:text-navy font-semibold rounded-full px-8 py-6 text-base cursor-pointer backdrop-blur-sm transition-all"
            >
              Explore Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
