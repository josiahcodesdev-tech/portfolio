import { Play } from "lucide-react";

export function VideoReel() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
              Video Reel
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
              How I work
            </h2>
            <p className="text-body-text text-lg leading-relaxed">
              From first conversation to final delivery — here&apos;s what the
              process actually looks like.
            </p>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-navy group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80')",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-navy ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3">
                <p className="text-white text-sm font-medium">
                  Watch: My consulting process
                </p>
                <p className="text-white/60 text-xs">2:30 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
