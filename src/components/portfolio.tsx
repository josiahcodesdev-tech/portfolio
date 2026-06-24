"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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
    title: "Corporate Website Redesign",
    category: "Web Design",
    description:
      "Complete redesign of a corporate website with modern UI/UX, responsive layout, and SEO optimization.",
    tag: "Development",
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
    title: "E-Commerce Platform",
    category: "Web Design",
    description:
      "Built a full-stack e-commerce platform with product management, payments, and analytics dashboard.",
    tag: "Development",
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

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
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
                <span className="text-navy/20 text-xs font-medium">
                  400 x 300
                </span>
                <div className="absolute top-4 left-4">
                  <span className="inline-block text-xs font-semibold text-white bg-gold px-3 py-1 rounded-full">
                    {project.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-gold text-navy font-bold px-6 py-2.5 rounded-full text-sm hover:bg-gold-hover transition-colors cursor-pointer flex items-center gap-2">
                    View Project <ArrowRight className="w-4 h-4" />
                  </button>
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
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
