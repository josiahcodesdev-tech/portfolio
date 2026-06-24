import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Startup Founder",
    location: "Nairobi",
    quote:
      "Josiah built our website in record time. Beautiful design, clean code, zero issues.",
    initials: "SK",
  },
  {
    name: "David M.",
    role: "NGO Director",
    location: "Mombasa",
    quote:
      "His proposal won us a KES 2M contract. Professional, compelling, delivered ahead of schedule.",
    initials: "DM",
  },
  {
    name: "Amina O.",
    role: "Graduate",
    location: "Nairobi",
    quote:
      "My new CV landed 3 interviews in one week. Outstanding work — genuinely impressed.",
    initials: "AO",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
            Testimonials
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
            What Clients Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative bg-light-gray rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <Quote className="w-10 h-10 text-gold/20 mb-4" />
              <p className="text-dark-text text-base leading-relaxed mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center shrink-0">
                  <span className="text-gold font-bold text-sm">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-navy font-semibold text-sm">{t.name}</p>
                  <p className="text-body-text text-xs">
                    {t.role}, {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
