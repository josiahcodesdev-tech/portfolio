import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { About } from "@/components/about";
import { Stats } from "@/components/stats";
import { Process } from "@/components/process";
import { CTA } from "@/components/cta";

export const metadata: Metadata = {
  title: "About | Josiah Mwangi",
  description:
    "Learn about Josiah Mwangi — a professional consultant with years of experience in web design, proposal writing, CV crafting, and more.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About Me"
        title="About Josiah Mwangi"
        description="A dedicated professional consultant empowering businesses, job seekers, and organizations to reach their full potential."
      />
      <About />
      <Stats />
      <Process />
      <CTA />
    </>
  );
}
