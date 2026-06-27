import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CvOptimizer } from "@/components/cv-optimizer";

export const metadata: Metadata = {
  title: "ATS CV Optimizer | Josiah Mwangi",
  description:
    "Free ATS CV optimization tool. Upload your CV, auto-parse it into ATS-friendly sections, edit your content, and download as PDF or Word.",
};

export default function OptimizePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy pt-[72px] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block bg-gold/20 text-gold text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Free Tool
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white mb-3">
            ATS CV Optimizer
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Upload your existing CV and instantly transform it into an
            ATS-friendly format. Edit sections, check your score, and download
            in PDF or Word.
          </p>
        </div>
      </section>

      {/* Optimizer */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CvOptimizer />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-12 lg:py-14 overflow-hidden">
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
            Need Professional Help?
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Let Me Craft Your CV
            <br />
            From Scratch
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Want a fully tailored, professionally written CV? Book a free
            consultation and I&apos;ll handle everything for you.
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
