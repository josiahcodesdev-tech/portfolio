import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Portfolio } from "@/components/portfolio";
import { CTA } from "@/components/cta";

export const metadata: Metadata = {
  title: "Portfolio | Josiah Mwangi",
  description:
    "Browse past projects and work samples — web design, grant proposals, CVs, brand identity, and more.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        label="Our Work"
        title="Portfolio & Work Samples"
        description="Browse through a selection of past projects showcasing the quality and diversity of our consulting services."
      />
      <Portfolio />
      <CTA />
    </>
  );
}
