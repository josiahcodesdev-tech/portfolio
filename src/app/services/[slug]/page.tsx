import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { servicesData, getServiceBySlug } from "@/lib/services-data";

export function generateStaticParams() {
  return servicesData.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} | Josiah Mwangi`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy pt-[72px]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block bg-gold/20 text-gold text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Service {service.num}
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white mb-3">
            {service.title}
          </h1>
          <p className="text-white/70 text-lg">{service.tagline}</p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${service.image}')` }}
              />
            </div>

            <div>
              <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
                What We Do
              </p>
              <h2 className="font-sans text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">
                {service.title},
                <br />
                Personalised to You
              </h2>
              <p className="text-body-text leading-relaxed mb-8">
                {service.longDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-7 py-5 text-sm cursor-pointer transition-all">
                    Book a Free Consultation
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    variant="outline"
                    className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded-full px-7 py-5 text-sm cursor-pointer transition-all"
                  >
                    ALL SERVICES
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 lg:py-28 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
              What&apos;s Included
            </p>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-navy mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-body-text max-w-2xl mx-auto">
              All sessions and deliverables are tailored to your specific needs,
              goals, and timeline.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature) => {
              const content = (
                <>
                  <div className="w-11 h-11 bg-gold-light rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-base font-bold text-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-body-text text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.link && (
                    <span className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold mt-3">
                      Fill out form <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  )}
                </>
              );

              return feature.link ? (
                <a
                  key={feature.title}
                  href={feature.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-gold border border-transparent transition-all block"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who It's For + How It Works */}
      <section className="py-20 lg:py-28 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Who It's For */}
            <div>
              <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
                Who It&apos;s For
              </p>
              <h2 className="font-sans text-3xl font-bold text-white mb-6">
                Built for People Who Want More
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Our {service.title} service is designed for clients at any stage
                who want to raise their standards, develop stronger outcomes, or
                get targeted support for a specific challenge.
              </p>
              <ul className="space-y-4">
                {service.whoItsFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How It Works */}
            <div>
              <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
                How It Works
              </p>
              <h2 className="font-sans text-3xl font-bold text-white mb-8">
                Our Process
              </h2>
              <div className="space-y-6">
                {service.process.map((step, i) => (
                  <div key={step.title} className="flex items-start gap-5">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-navy font-bold text-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        {step.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
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
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-5">
            Take the Next Step
          </p>
          <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Ready to Get Started
            <br />
            with {service.title}?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Book a free consultation and take the next step towards professional
            success and confidence.
          </p>
          <Link href="/contact">
            <Button className="bg-gold text-navy font-bold hover:bg-gold-hover px-10 py-6 text-base cursor-pointer transition-all">
              Book Your Free Consultation
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
