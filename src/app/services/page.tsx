import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Features } from "@/components/features";
import { Services } from "@/components/services";
import { CTA } from "@/components/cta";

export const metadata: Metadata = {
  title: "Services | Josiah Mwangi",
  description:
    "Explore our six core consulting services — web design, proposal writing, CV crafting, data entry, job matching, and graphic design.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="What We Offer"
        title="Our Services"
        description="Six core services designed to help you succeed — from web design and proposal writing to career optimization and creative solutions."
      />
      <Features />
      <Services />
      <CTA />
    </>
  );
}
