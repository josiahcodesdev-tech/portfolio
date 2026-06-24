const stats = [
  { number: "50+", label: "Clients Served" },
  { number: "98%", label: "Satisfaction Rate" },
  { number: "5+", label: "Years Experience" },
  { number: "6", label: "Core Services" },
];

export function Stats() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-navy">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80')",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Trusted by Clients Across Industries
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            With a proven track record of delivering quality results, we help
            businesses and individuals achieve their goals efficiently.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white/5 backdrop-blur-sm rounded-2xl py-8 px-4 border border-white/10"
            >
              <span className="block text-4xl sm:text-5xl font-bold text-gold mb-2">
                {stat.number}
              </span>
              <span className="text-sm text-white/80 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
