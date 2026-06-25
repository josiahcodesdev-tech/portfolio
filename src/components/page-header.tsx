interface PageHeaderProps {
  label: string;
  title: string;
  description: string;
}

export function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <section className="relative bg-navy pt-[72px] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
          {label}
        </p>
        <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">{description}</p>
      </div>
    </section>
  );
}
