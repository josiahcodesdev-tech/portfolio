import Link from "next/link";
import { ArrowRight, Star, FolderCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[630px] flex items-center overflow-hidden bg-navy">
      {/* Ambient glow + subtle texture */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-gold/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] bg-gold/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* Left — personal intro */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="text-xs font-medium tracking-wide text-white/80">
                Available for new projects
              </span>
            </div>

            <p className="text-gold font-medium text-sm tracking-widest uppercase mb-4">
              Hi, I&apos;m Josiah Mwangi
            </p>
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-[58px] font-bold text-white leading-[1.1] mb-6">
              Your partner for{" "}
              <span className="text-gold">work that gets results</span>
            </h1>
            <p className="text-lg text-white/75 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-9">
              An independent consultant helping businesses, job seekers, and
              organizations move forward — from websites and winning proposals
              to standout CVs and brand design. One person, fully invested in
              your success.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
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

            {/* Trust row */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-gold text-gold"
                    />
                  ))}
                </div>
                <span className="text-sm text-white/70">
                  Trusted by{" "}
                  <span className="font-semibold text-white">100+ clients</span>
                </span>
              </div>
              <div className="hidden sm:block w-px h-5 bg-white/20" />
              <span className="text-sm text-white/70">
                <span className="font-semibold text-white">5+ years</span> of
                hands-on experience
              </span>
            </div>
          </div>

          {/* Right — portrait + floating accents */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-b from-navy-light to-navy shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-gold/15 backdrop-blur-sm border border-gold/30 flex items-center justify-center">
                  <span className="text-4xl font-sans font-bold text-gold">
                    JM
                  </span>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-semibold text-lg">
                  Josiah Mwangi
                </p>
                <p className="text-white/60 text-sm">
                  Independent Consultant &amp; Web Developer
                </p>
              </div>
            </div>

            {/* Floating: projects delivered */}
            <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl px-5 py-3.5 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-light flex items-center justify-center">
                <FolderCheck className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-navy font-bold text-lg leading-none">50+</p>
                <p className="text-body-text text-xs mt-1">Projects delivered</p>
              </div>
            </div>

            {/* Floating: response CTA */}
            <Link
              href="/services"
              className="group absolute -bottom-5 -right-3 sm:-right-6 bg-gold rounded-2xl px-5 py-3.5 shadow-xl flex items-center gap-3 cursor-pointer hover:bg-gold-hover transition-colors"
            >
              <div>
                <p className="text-navy font-bold text-sm leading-none">
                  6 service areas
                </p>
                <p className="text-navy/70 text-xs mt-1">See what I do</p>
              </div>
              <ArrowRight className="w-4 h-4 text-navy group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
