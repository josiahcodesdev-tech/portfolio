import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    slug: "web-development",
    tag: "Development",
    title: "Web Design",
    description:
      "End-to-end design and development of professional websites tailored to business needs. Includes responsive layouts, UI/UX design, and modern technology stacks.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    slug: "proposal-writing",
    tag: "Writing",
    title: "Proposal Writing & Grants",
    description:
      "Professional proposal and grant writing services for NGOs, businesses, and individuals. Crafting compelling, well-researched documents that win funding.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
  },
  {
    slug: "cv-cover-letters",
    tag: "Career",
    title: "CV & Cover Letter Writing",
    description:
      "Expert CV and cover letter crafting tailored to industry and role. Optimized for ATS and designed to stand out to hiring managers.",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
  },
  {
    slug: "data-services",
    tag: "Data",
    title: "Data Entry",
    description:
      "Accurate and efficient data entry services for businesses of all sizes. Including database management, spreadsheet population, and CRM data input.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
  {
    slug: "job-matching",
    tag: "Career",
    title: "Job Matching CVs",
    description:
      "Specialized service to match and tailor existing CVs to specific job descriptions, maximizing the chance of shortlisting with keyword optimization.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80",
  },
  {
    slug: "graphic-design",
    tag: "Design",
    title: "Graphic Design",
    description:
      "Creative graphic design for digital and print media. Including logos, branding materials, social media graphics, flyers, and marketing collateral.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  },
];

export function Services() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
            What We Offer
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
            How We Support You
          </h2>
          <p className="mt-4 text-body-text max-w-2xl mx-auto">
            Six core services designed to help you succeed — from web design and
            proposal writing to career optimization and creative solutions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service.title} href={`/services/${service.slug}`}>
              <Card className="group bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden py-0 h-full cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${service.image}')` }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-navy bg-gold px-3 py-1">
                      {service.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-navy mb-2">
                    {service.title}
                  </h3>
                  <p className="text-body-text text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
