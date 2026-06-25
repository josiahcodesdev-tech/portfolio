"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, ExternalLink, X, Globe } from "lucide-react";

const categories = [
  "All",
  "Web Design",
  "CV Writing",
  "Proposals",
  "Graphic Design",
  "Data Entry",
];

const projects = [
  {
    title: "GradElevate",
    category: "Web Design",
    description:
      "Academic success platform with tutoring, dissertation support, and career development services.",
    tag: "Development",
    url: "https://www.gradelevate.co.uk/",
  },
  {
    title: "TrendyLocs",
    category: "Web Design",
    description:
      "Modern e-commerce and brand website for a trendy hair and beauty business.",
    tag: "Development",
    url: "https://www.trendylocs.com/",
  },
  {
    title: "NGO Grant Proposal",
    category: "Proposals",
    description:
      "Successfully funded $50K grant proposal for a community development NGO project.",
    tag: "Writing",
  },
  {
    title: "Executive CV Package",
    category: "CV Writing",
    description:
      "Professional CV and cover letter suite for a senior executive transitioning into fintech.",
    tag: "Career",
  },
  {
    title: "Brand Identity Design",
    category: "Graphic Design",
    description:
      "Complete brand identity including logo, business cards, letterhead, and social media templates.",
    tag: "Design",
  },
  {
    title: "CRM Data Migration",
    category: "Data Entry",
    description:
      "Migrated 10,000+ records from legacy systems to a modern CRM with 99.9% accuracy.",
    tag: "Data",
  },
];

export function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <>
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
              Our Work
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
              Portfolio & Work Samples
            </h2>
            <p className="mt-4 text-body-text max-w-2xl mx-auto">
              Browse through a selection of past projects showcasing the quality
              and diversity of our consulting services.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all cursor-pointer ${
                  filter === cat
                    ? "bg-gold text-navy shadow-sm"
                    : "bg-light-gray text-body-text hover:bg-gold-light hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <Card
                key={project.title}
                className="group overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl py-0"
              >
                <div className="relative w-full h-52 bg-gradient-to-br from-navy/5 to-navy/10 flex items-center justify-center">
                  {project.url ? (
                    <div className="absolute inset-0 overflow-hidden">
                      <iframe
                        src={project.url}
                        title={project.title}
                        className="w-[1280px] h-[800px] origin-top-left scale-[0.29] pointer-events-none"
                        loading="lazy"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  ) : (
                    <span className="text-navy/20 text-xs font-medium">
                      400 x 300
                    </span>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block text-xs font-semibold text-white bg-gold px-3 py-1 rounded-full">
                      {project.tag}
                    </span>
                  </div>
                  {project.url && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <Globe className="w-4 h-4 text-navy" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    {project.url ? (
                      <>
                        <button
                          onClick={() => setPreviewUrl(project.url!)}
                          className="bg-gold text-navy font-bold px-5 py-2.5 rounded-full text-sm hover:bg-gold-hover transition-colors cursor-pointer flex items-center gap-2"
                        >
                          Preview <ArrowRight className="w-4 h-4" />
                        </button>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/20 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-white hover:text-navy transition-colors flex items-center gap-2"
                        >
                          Visit <ExternalLink className="w-4 h-4" />
                        </a>
                      </>
                    ) : (
                      <button className="bg-gold text-navy font-bold px-6 py-2.5 rounded-full text-sm hover:bg-gold-hover transition-colors cursor-pointer flex items-center gap-2">
                        View Project <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-block text-xs font-medium text-gold mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-bold text-navy mb-2">
                    {project.title}
                  </h3>
                  <p className="text-body-text text-sm leading-relaxed">
                    {project.description}
                  </p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold mt-3 hover:gap-2.5 transition-all"
                    >
                      {new URL(project.url).hostname}{" "}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-light-gray border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gold" />
                <span className="text-sm text-dark-text font-medium truncate max-w-md">
                  {previewUrl}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold font-semibold hover:underline flex items-center gap-1"
                >
                  Open in new tab <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-dark-text hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <iframe
              src={previewUrl}
              title="Website Preview"
              className="flex-1 w-full"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </>
  );
}
