import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Contact } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact | Josiah Mwangi",
  description:
    "Get in touch with Josiah Mwangi for a free consultation. Send a message or reach out via email or phone.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Get in Touch"
        description="Have a question or ready to start a project? We'd love to hear from you."
      />
      <Contact />
    </>
  );
}
