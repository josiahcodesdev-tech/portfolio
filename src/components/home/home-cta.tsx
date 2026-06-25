import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeCTA() {
  return (
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
          Got a Project in Mind?
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
  );
}
