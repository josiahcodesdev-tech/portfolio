import { Code2, Handshake, PenTool, Users } from "lucide-react";

const photos = [
  {
    icon: Code2,
    label: "Coding",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
    alt: "Coding and development work",
  },
  {
    icon: Handshake,
    label: "Client Meetings",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80",
    alt: "Client meeting and consultation",
  },
  {
    icon: PenTool,
    label: "Design Work",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    alt: "Graphic design and creative work",
  },
  {
    icon: Users,
    label: "Team Collaboration",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
    alt: "Team collaboration and brainstorming",
  },
];

export function BehindScenes() {
  return (
    <section className="py-20 lg:py-28 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
            Behind the Scenes
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Real work, real results.
            <br />
            <span className="text-white/60 font-normal text-xl sm:text-2xl font-sans">
              No stock-photo energy.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {photos.map((photo) => {
            const Icon = photo.icon;
            return (
              <div
                key={photo.label}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${photo.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gold/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {photo.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
