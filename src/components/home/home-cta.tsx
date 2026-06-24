import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeCTA() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-navy/85" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
            Got a project in mind?
          </h2>
          <p className="text-white/60 text-sm mt-1">
            No pitch decks needed — just tell me what you&apos;re working on.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/contact">
            <Button className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-6 py-5 text-sm cursor-pointer transition-all">
              Start a conversation
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button
              variant="outline"
              className="border-2 border-white/30 text-white bg-white/10 hover:bg-white hover:text-navy font-semibold rounded-full px-6 py-5 text-sm cursor-pointer backdrop-blur-sm transition-all"
            >
              See past work
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
