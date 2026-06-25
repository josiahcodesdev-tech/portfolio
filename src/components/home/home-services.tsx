"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  FileText,
  Palette,
  FileCheck,
  Target,
  Database,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const services = [
  {
    num: "01",
    slug: "web-development",
    icon: Globe,
    title: "Web Development",
    description: "Custom websites & applications",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    num: "02",
    slug: "proposal-writing",
    icon: FileText,
    title: "Proposal Writing",
    description: "Documents that make decision-makers say yes",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
  },
  {
    num: "03",
    slug: "graphic-design",
    icon: Palette,
    title: "Graphic Design",
    description: "Brand identities people actually remember",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  },
  {
    num: "04",
    slug: "cv-cover-letters",
    icon: FileCheck,
    title: "CV & Cover Letters",
    description: "Experience told in a way that gets callbacks",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
  },
  {
    num: "05",
    slug: "job-matching",
    icon: Target,
    title: "Job Matching",
    description: "Connecting the right people to the right opportunities",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80",
  },
  {
    num: "06",
    slug: "data-services",
    icon: Database,
    title: "Data Services",
    description: "Messy spreadsheets in, clean decisions out",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
];

const VISIBLE = 3;
const MAX_INDEX = services.length - VISIBLE;

export function HomeServices() {
  const [index, setIndex] = useState(0);

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, MAX_INDEX)),
    [],
  );
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i >= MAX_INDEX ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
              Services Overview
            </p>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white">
              What I Do
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={prev}
              disabled={index === 0}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-navy disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={index >= MAX_INDEX}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-navy disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              gap: "24px",
              transform: `translateX(calc(-${index} * (calc(100% / 3 + 8px))))`,
            }}
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.num}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 shrink-0"
                  style={{ width: "calc((100% - 48px) / 3)" }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url('${service.image}')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-gold font-bold text-2xl font-sans">
                        {service.num}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-navy mb-1.5">
                      {service.title}
                    </h3>
                    <p className="text-body-text text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all"
                    >
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: MAX_INDEX + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === index ? "w-8 bg-gold" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Mobile: show arrows below */}
        <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
          <button
            onClick={prev}
            disabled={index === 0}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-navy disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            disabled={index >= MAX_INDEX}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-navy disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
